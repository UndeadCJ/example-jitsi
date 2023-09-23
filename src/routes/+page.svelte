<script lang="ts">
    import {createScreenSharingExample, exitMeeting, muteMic, muteScreenAudio, stopScreen} from "$lib/jitsi";
    import {start} from "$lib/jitsi-pip";
    import {generateMeeting} from "$lib/jitsi-tab";

    let started = false
    let sharingScreen = false

    let hostLink = ""
    let attendeeLink = ""

    function setLinks(host: string = "", attendee: string = "") {
        hostLink = host
        attendeeLink = attendee
    }

    function initMeeting() {
        const [host, attendee] = generateMeeting()
        setLinks(host, attendee)
    }

    function exitMeetingHanlder() {
        exitMeeting()
        sharingScreen = false
    }

    function initPIP() {
        const attendee = start(async () => {
            console.log("Saindo da reuniao...")

            setLinks("", "")
            started = false
        })

        setLinks("", attendee)
        started = true
    }

    async function initScreenSharing() {
        const attendee = await createScreenSharingExample()
        sharingScreen = true

        setLinks("", attendee)
    }
</script>


<div class="relative w-full h-full bg-gray-100 p-4">
    <button on:click={initMeeting} class="p-4 text-white bg-purple-600 hover:bg-purple-800 rounded-xl">
        Iniciar Chamada
    </button>
    <button on:click={initPIP} class="p-4 text-white bg-sky-600 hover:bg-sky-800 rounded-xl">
        Iniciar Chamada PIP
    </button>
    <button on:click={initScreenSharing} class="p-4 text-white bg-pink-600 hover:bg-pink-800 rounded-xl">
        Iniciar Compartilhamento
    </button>

    <div class="mt-4 text-sm">
        {#if hostLink}
            <div class="mt-2">
                <p class="break-words"><b>Host: </b> {hostLink}</p>
            </div>
        {/if}
        {#if attendeeLink}
            <div class="mt-2">
                <p class="break-words"><b>Attendee: </b>{attendeeLink}</p>
            </div>
        {/if}
    </div>


    <div class="{!started ? 'hidden' : ''} absolute m-4 right-0 bottom-0 w-3/6 rounded-xl drop-shadow-lg bg-white p-1">
        <div id="jitsi-iframe" class="rounded-xl"/>
    </div>
</div>

{#if sharingScreen}
    <div class="absolute flex justify-center items-center bottom-0 left-0 h-16 w-full bg-red-500">
        <button class="text-white bg-cyan-500 rounded-lg p-2 m-2" on:click={stopScreen}>Compartilhar</button>
        <button class="text-white bg-cyan-500 rounded-lg p-2 m-2" on:click={muteScreenAudio}>Mute Screen</button>
        <button class="text-white bg-cyan-500 rounded-lg p-2 m-2" on:click={muteMic}>Mute</button>
        <button class="text-white bg-cyan-500 rounded-lg p-2 m-2" on:click={exitMeetingHanlder}>Desconectar</button>
    </div>
{/if}


<style>
    :global(#jitsi-iframe iframe) {
        height: 20rem !important;
        border-radius: 0.75rem !important;
    }
</style>