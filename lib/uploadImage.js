import { fileTypeFromBuffer } from "file-type";

/**
 * Upload file to top4top.io
 * Supports all media types: images, audio, video, documents
 * @param {Buffer} buffer File Buffer
 * @returns {string} Download URL
 */
export default async function uploadImage(buffer) {
    const origin = 'https://top4top.io';
    const f = await fileTypeFromBuffer(buffer);
    if (!f) throw new Error('Failed to get file extension/buffer');

    const data = new FormData();
    const file = new File([buffer], Date.now() + '.' + f.ext);
    data.append('file_1_', file);
    data.append('submitr', '[ رفع الملفات ]');

    const options = {
        method: 'POST',
        body: data
    };

    console.log('Uploading file... ' + file.name);
    const response = await fetch(origin + '/index.php', options);
    
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}\n${await response.text()}`);
    }
    
    const html = await response.text();
    const matches = html.matchAll(/<input readonly="readonly" class="all_boxes" onclick="this.select\(\);" type="text" value="(.+?)" \/>/g);
    const arr = Array.from(matches);
    
    if (!arr.length) {
        throw new Error('Failed to upload file');
    }
    
    const downloadUrl = arr.map(v => v[1]).find(v => v.endsWith(f.ext));
    
    if (!downloadUrl) {
        throw new Error('Download URL not found');
    }
    
    return downloadUrl;
}