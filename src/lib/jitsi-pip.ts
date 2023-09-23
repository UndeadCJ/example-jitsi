import {createLink, createToken, roomName, setClipboard} from "$lib/jwt";

const domain = "video.raioss.rocks";
let api = {};

const handleClose = () => {
    console.log("handleClose");

    alert("Saindo...")
};

const handleParticipantLeft = async (participant: object) => {
    console.log("handleParticipantLeft", participant);
    await getParticipants();
};

const handleParticipantJoined = async (participant: object) => {
    console.log("handleParticipantJoined", participant);

    alert(`${participant} acabou de entrar!`)

    await getParticipants();
};

const handleVideoConferenceJoined = async (participant: object) => {
    console.log("handleVideoConferenceJoined", participant);
    await getParticipants();
};

const getParticipants = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(api.getParticipantsInfo());
        }, 500);
    });
};

export function start(onClose: (participant: string) => Promise<void>) {
    const options = {
        roomName: roomName,
        jwt: createToken("Host", "example@example.com", 4),
        width: "100%",
        height: 500,
        configOverwrite: { prejoinPageEnabled: false },
        interfaceConfigOverwrite: {},
        parentNode: document.querySelector("#jitsi-iframe"),
        userInfo: {
            displayName: "Lucas",
        },
    };
    api = new JitsiMeetExternalAPI(domain, options);

    api.addEventListeners({
        readyToClose: handleClose,
        participantLeft: handleParticipantLeft,
        participantJoined: handleParticipantJoined,
        videoConferenceJoined: handleVideoConferenceJoined,
        videoConferenceLeft: onClose,
    });

    const participantToken = createToken("Convidado", undefined, 3)
    const participantURL = createLink(participantToken)

    setClipboard(participantURL)

    return participantURL
}