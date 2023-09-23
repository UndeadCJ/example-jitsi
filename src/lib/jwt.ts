import sign from "jwt-encode";

export const roomName = "sala_teste"

export function signToken(payload: object) {
    return sign(payload, import.meta.env.VITE_VIDEO_SECRET)
}

export function createToken(name: string, email: string | undefined, expiration: number = 3) {
    const exp = new Date()

    exp.setHours(exp.getHours() + expiration)

    return signToken(
        {
            "context": {
                "user": {
                    "name": name,
                    "email": email
                }
            },
            "aud": "jitsi",
            "iss": import.meta.env.VITE_VIDEO_ISS,
            "sub": import.meta.env.VITE_VIDEO_URL,
            "room": "*",
            "exp": exp.valueOf()
        }
    )
}

export function createLink(token: string) {
    return `https://video.raioss.rocks/${roomName}?jwt=${token}`
}

export function setClipboard(text: string) {
    const type = "text/plain";
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(
        () => {
            console.log("COPIADO")
        },
        () => {
            console.log("FALHA AO COPIAR")
        },
    );
}