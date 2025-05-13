(function() {
    function handleReddit(url) {
        url.search = "";
        const match = /^\/r\/[^/]+\/comments\/(\w+)\/[^/]+\/$/.exec(url.pathname);
        if(!match)
            return;
        url.href = `https://redd.it/${match[1]}`;
    }
    function handleYoutube(url) {
        url.searchParams.delete("si");
    }
    function handleCopy(text) {
        const url = URL.parse(text);
        if(!url)
            return navigator.clipboard._writeText(arguments);
        switch(url.host) {
            case "www.reddit.com":
                handleReddit(url);
                break;
            case "youtu.be":
                handleYoutube(url);
                break;
        }
        return navigator.clipboard._writeText(url.href);
    }
    navigator.clipboard._writeText = window.navigator.clipboard.writeText;
    navigator.clipboard.writeText = async function(text) {
        handleCopy(text);
    }
    document.nativeExecCommand = document.execCommand;
    document.execCommand = function(cmd) {
        if(cmd !== "copy")
            return document.nativeExecCommand(arguments);
        const focus = document.activeElement;
        if(!focus || !(focus instanceof HTMLInputElement))
            return document.nativeExecCommand(arguments);
        const selection = focus.value.substring(focus.selectionStart, focus.selectionEnd);
        handleCopy(selection);

    }
    console.log("Share No-Track!");
})();