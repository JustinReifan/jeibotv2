import axios from 'axios'

const SPOTIFY_CLIENT_ID = '4c4fc8c3496243cbba99b39826e2841f'
const SPOTIFY_CLIENT_SECRET = 'd598f89aba0946e2b85fb8aefa9ae4c8'

const convert = async (ms) => {
    let minutes = Math.floor(ms / 60000)
    let seconds = ((ms % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

const spotifyCreds = async () => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        const json = response.data
        if (!json.access_token) {
            return { status: false, msg: "Can't generate token!" }
        }
        return { status: true, data: json }
    } catch (error) {
        return { status: false, msg: error.message }
    }
}

const getInfo = async (url) => {
    try {
        const creds = await spotifyCreds()
        if (!creds.status) return creds

        const trackId = url.split('track/')[1]
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: { Authorization: `Bearer ${creds.data.access_token}` },
        })

        const json = response.data
        return {
            status: true,
            data: {
                thumbnail: json.album.images[0]?.url || null,
                title: `${json.artists[0]?.name} - ${json.name}`,
                artist: json.artists[0],
                duration: await convert(json.duration_ms),
                preview: json.preview_url || null,
            },
        }
    } catch (error) {
        return { status: false, msg: error.message }
    }
}

const searching = async (query, type = 'track', limit = 20) => {
    try {
        const creds = await spotifyCreds()
        if (!creds.status) return creds

        const response = await axios.get(
            `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=${type}&offset=0&limit=${limit}`,
            {
                headers: { Authorization: `Bearer ${creds.data.access_token}` },
            }
        )

        const json = response.data
        if (!json.tracks.items.length) return { status: false, msg: 'Music not found!' }

        const data = json.tracks.items.map((v) => ({
            title: `${v.album.artists[0].name} - ${v.name}`,
            duration: convert(v.duration_ms),
            popularity: `${v.popularity}%`,
            preview: v.preview_url,
            url: v.external_urls.spotify,
        }))

        return { status: true, data }
    } catch (error) {
        return { status: false, msg: error.message }
    }
}

const spotifydl = async (url) => {
    try {
        const { data: yanzzData } = await axios.get(
            `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`,
            {
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    Referer: 'https://spotifydownload.org/',
                },
            }
        )

        const { data: yanzData } = await axios.get(
            `https://api.fabdl.com/spotify/mp3-convert-task/${yanzzData.result.gid}/${yanzzData.result.id}`,
            {
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    Referer: 'https://spotifydownload.org/',
                },
            }
        )

        return {
            title: yanzzData.result.name,
            type: yanzzData.result.type,
            artis: yanzzData.result.artists,
            durasi: yanzzData.result.duration_ms,
            image: yanzzData.result.image,
            download: `https://api.fabdl.com${yanzData.result.download_url}`,
        }
    } catch (error) {
        return { status: false, msg: error.message }
    }
}

export { searching, getInfo, spotifydl }
