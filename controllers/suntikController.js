import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Tinped from "../lib/tinped.js";
import duitku from "../lib/duitku.js";

// fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, "..", "database");
const PRICELIST_FILE = path.join(DB_DIR, "pricelist.json");
const ORDERS_FILE = path.join(DB_DIR, "suntik_orders.json");
const PAYMENTS_FILE = path.join(DB_DIR, "suntik_payments.json");

function readJson(file, defaultVal = []) {
  try {
    if (!fs.existsSync(file)) return defaultVal;
    return JSON.parse(fs.readFileSync(file, "utf8") || "[]");
  } catch (e) {
    return defaultVal;
  }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function getBalance(api_id, api_key) {
  const res = await Tinped.getProfile(api_id, api_key);

  if (res && res.status) {
    return res.data;
  } else {
    throw new Error(res.data || "Gagal ambil balance Tinped");
  }
}

/**
 * pricelist: ambil dari Tinped, cache ke DB
 */
async function pricelist(api_id, api_key) {
  const res = await Tinped.getServices(api_id, api_key);
  if (res && res.status) {
    writeJson(PRICELIST_FILE, res.data);
    return res.data;
  } else {
    throw new Error(res.data || "Gagal ambil pricelist Tinped");
  }
}

/**
 * orderSuntik:
 * - buat internal order record
 * - create duitku invoice
 * - return invoice info (QR/URL) ke caller
 *
 * params: { api_id, api_key, serviceId, qty, target, buyerPhone, buyerName }
 */
async function orderSuntik(params) {
  const {
    m,
    api_id,
    api_key,
    serviceId,
    qty,
    target,
    buyerPhone,
    buyerName,
    returnUrl,
    callbackUrl,
  } = params;

  // 1) ambil layanan dari cache / Tinped
  let services = readJson(PRICELIST_FILE, null);
  if (!services || services.length === 0) {
    services = await pricelist(api_id, api_key);
  }
  const service = services.find(
    (s) => s.service == String(serviceId) || s.service == serviceId
  );
  if (!service) throw new Error("Layanan tidak ditemukan pada pricelist");

  // check order quantity meet min/max
  if (service.min > Number(qty) || service.max < Number(qty)) {
    throw new Error(
      `Jumlah pesanan harus antara ${service.min} - ${service.max}`
    );
  }

  const pricePerUnit = Number(service.price) / 1000;
  const total = parseInt(pricePerUnit * Number(qty));

  //   cek apakah nominal > Rp 10000
  if (total < 1000) {
    throw new Error("Nominal pembelian harus lebih dari Rp 1000");
    return;
  }

  // 2) buat internal order id (prefix SNTK- + timestamp)
  const orderId = `JEI-${Date.now()}`;

  // 3) simpan order pending (belum kirim ke Tinped sampai payment success)
  const orders = readJson(ORDERS_FILE, []);
  const orderRecord = {
    groupId: m.chat ?? null,
    orderId,
    serviceId,
    serviceName: service.name,
    qty,
    target,
    buyerPhone,
    buyerName,
    total,
    status: "pending_payment",
    createdAt: new Date().toISOString(),
  };
  orders.push(orderRecord);
  writeJson(ORDERS_FILE, orders);

  // 4) create duitku invoice
  // bagian orderSuntik di suntikController.js
  const invoice = await duitku.createTransaction({
    amount: total,
    merchantOrderId: orderId,
    productDetails: `${service.name} x ${qty}`,
    returnUrl,
    callbackUrl,
    paymentMethod: "SQ",
    customerVaName: buyerName,
    customerEmail: "",
  });

  // simpan payment record
  const payments = readJson(PAYMENTS_FILE, []);
  payments.push({
    orderId,
    merchantOrderId: invoice?.merchantOrderId || orderId,
    duitkuResponse: invoice,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  writeJson(PAYMENTS_FILE, payments);

  // return invoice response to caller (it contains paymentUrl or qr)
  return { order: orderRecord, invoice };
}

/**
 * paymentCallback - route handler untuk Duitku IPN
 * body: posted data from duitku
 */
async function paymentCallback(headers, body) {
  // Duitku v2 kirim body JSON
  if (!duitku.verifyCallback(body)) {
    throw new Error("Invalid signature from Duitku");
  }

  const { merchantOrderId, resultCode, reference, paymentAmount } = body;

  const payments = readJson(PAYMENTS_FILE, []);
  const p = payments.find(
    (x) => x.merchantOrderId == merchantOrderId && x.status == "pending"
  );
  if (!p)
    return { ok: false, message: "payment not found or already processed" };

  p.status = resultCode === "00" ? "paid" : "failed";
  p.reference = reference;
  p.updatedAt = new Date().toISOString();
  writeJson(PAYMENTS_FILE, payments);

  if (p.status === "paid") {
    // trigger order ke Tinped
    const orders = readJson(ORDERS_FILE, []);
    const ord = orders.find(
      (o) => o.orderId == merchantOrderId && o.status == "pending_payment"
    );
    if (!ord)
      return { ok: false, message: "order not found or already processed" };

    try {
      const TinpedRes = await Tinped.createOrder(
        global.Tinped_id,
        global.Tinped_key,
        ord.serviceId,
        ord.target,
        ord.qty
      );
      ord.status = TinpedRes.status ? "ordered" : "order_failed";
      ord.TinpedResponse = TinpedRes;
      ord.updatedAt = new Date().toISOString();
      writeJson(ORDERS_FILE, orders);

      return {
        ok: TinpedRes.status,
        type: TinpedRes.status ? "ordered" : "order_failed",
        order: ord,
        TinpedRes,
      };
    } catch (e) {
      ord.status = "order_error";
      ord.orderError = e.message;
      ord.updatedAt = new Date().toISOString();
      writeJson(ORDERS_FILE, orders);
      return { ok: false, type: "order_error", order: ord, error: e.message };
    }
  }

  return { ok: false, type: "payment_failed", payment: p };
}

/**
 * cekSuntik: cek status order via Tinped status
 * param: Tinped order id or internal orderId
 */
async function cekSuntik(orderIdOrInternalId) {
  const orders = readJson(ORDERS_FILE, []);
  const ord = orders.find(
    (o) =>
      o.orderId == orderIdOrInternalId ||
      (o.TinpedResponse &&
        o.TinpedResponse.data &&
        String(o.TinpedResponse.data.id) == String(orderIdOrInternalId))
  );
  if (!ord) throw new Error("Order tidak ditemukan");

  const TinpedId = ord.TinpedResponse?.data?.id;

  //   find payment record
  const payments = readJson(PAYMENTS_FILE, []);
  const p = payments.find((p) => p.orderId == ord.orderId);
  if (p) ord.payment = p;

  if (!TinpedId) {
    // belum ke-create di provider (belum bayar / pending_payment)
    return {
      order: ord,
      status: null,
      paymentUrl: ord.payment?.duitkuResponse.paymentUrl,
    };
  }

  const status = await Tinped.getStatus(
    global.Tinped_id,
    global.Tinped_key,
    TinpedId
  );

  return {
    order: ord,
    status,
    paymentUrl: ord.payment?.duitkuResponse.paymentUrl,
  };
}

export default {
  pricelist,
  orderSuntik,
  paymentCallback,
  cekSuntik,
  getBalance,
};
