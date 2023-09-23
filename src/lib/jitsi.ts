import {createLink, createToken, roomName, setClipboard} from "$lib/jwt";


export let connection = undefined
export let room = undefined
export let roomTracks = {
    audio: [],
    screen: []
}
export let stoppedSharing = false

export function createTracksAndAddToRoom(room: string) {
    JitsiMeetJS.createLocalTracks({devices: ["desktop", "audio"]}).then((tracks) => {
        tracks.forEach(track => {
            if (track.getType() === "video" && track.videoType === "desktop") {
                roomTracks.screen.push(track)
            } else if (track.getType() === "audio") {
                roomTracks.audio.push(track)
            }

            room.addTrack(track);
        });
    }).catch(error => {
            console.error('There was an error creating the local tracks:', error);
        }
    );
}

export function muteScreenAudio() {
    roomTracks.audio.forEach((device) => {
        if (device.track.label === "Tab audio") {
            if (device.isMuted()) {
                device.unmute()
            } else {
                device.mute()
            }
        }
    })
}

export function exitMeeting() {
    stopScreen()
    room.leave()
}

export function stopScreen() {
    if (!stoppedSharing) {
        stoppedSharing = true

        roomTracks.screen.forEach((track) => {
            track.dispose()
        })

        roomTracks.audio.forEach((track) => {
            if (track.track.label === "Tab audio") {
                 track.dispose()
            }
        })
    } else {
        stoppedSharing = false

        JitsiMeetJS.createLocalTracks({devices: ["desktop"]}).then((tracks) => {
            tracks.forEach(track => {
                if (track.getType() === "video" && track.videoType === "desktop") {
                    roomTracks.screen.push(track)
                } else if (track.getType() === "audio") {
                    roomTracks.audio.push(track)
                }

                room.addTrack(track)
            });
        })
    }
}

export function muteMic() {
    roomTracks.audio.forEach((device) => {
        if (device.track.label === "audio") {
            if (device.isMuted()) {
                device.unmute()
            } else {
                device.mute()
            }
        }
    })
}

export function createConnection() {
    const hostToken = createToken("Host", "example@example.com", 5)

    const options = {
        hosts: {
            domain: import.meta.env.VITE_VIDEO_URL,
            muc: `conference.${import.meta.env.VITE_VIDEO_URL}`,
            focus: `focus.${import.meta.env.VITE_VIDEO_URL}`
        },
        serviceUrl: `https://${import.meta.env.VITE_VIDEO_URL}/http-bind`
    }

    JitsiMeetJS.init();
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.INFO);

    return new Promise(((resolve, reject) => {
        connection = new JitsiMeetJS.JitsiConnection(null, hostToken, options);

        connection?.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, () => {
            resolve(connection);
        });
        connection?.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, () => {
            reject('The connection failed.');
        });
        connection?.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, () => {
            console.log("Connection disconnected");
        });

        connection?.connect();
    }))
}


export function createAndJoinRoom(connection: any, roomName: string) {
    return new Promise((resolve) => {
        room = connection.initJitsiConference(roomName, {});
        room?.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
            resolve(room);
        });
        room?.join();
    });
}

export async function createScreenSharingExample() {
    const participantToken = createToken("Convidado", undefined, 3)
    const participantURL = createLink(participantToken)

    setClipboard(participantURL)

    createConnection().then((connection) => {
        return createAndJoinRoom(connection, roomName)
    }).then((roomObj) => {
        createTracksAndAddToRoom(roomObj)
    }).catch(error => console.error(error));

    return participantURL
}