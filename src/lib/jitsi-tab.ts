import {createLink, createToken, setClipboard} from "$lib/jwt";

export function generateMeeting() {
    const participantToken = createToken("Convidado", undefined, 3)
    const hostToken = createToken("Host", "example@example.com", 5)

    const participantURL = createLink(participantToken)
    const hostURL = createLink(hostToken)

    setClipboard(participantURL)
    window.open(hostURL, "_blank")

    return [hostURL, participantURL]
}