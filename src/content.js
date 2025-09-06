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
    function handleTwitter(url) {
        url.host = "fixupx.com"
    }
    function handleTiktok(url) {
        url.searchParams.delete("is_from_webapp")
        url.searchParams.delete("sender_device")
        url.searchParams.delete("web_id")
    }
    function handleCopy(text) {
        const url = URL.parse(text);
        if(!url)
            return false;
        switch(url.host) {
            case "www.reddit.com":
                handleReddit(url);
                break;
            case "www.youtube.com":
            case "youtube.com":
            case "youtu.be":
            case "music.youtube.com":
                handleYoutube(url);
                break;
            case "x.com":
                handleTwitter(url);
                break;
            case "tiktok.com":
                handleTiktok(url);
                break;
            default:
                return false;
        }
        return navigator.clipboard._writeText(url.href);
    }
    navigator.clipboard._writeText ??= navigator.clipboard.writeText;
    navigator.clipboard.writeText = async function(text) {
        if(!handleCopy(text))
            return navigator.clipboard._writeText(...arguments);
    }
    document._execCommand ??= document.execCommand;
    document.execCommand = function(cmd) {
        if(cmd !== "copy")
            return document._execCommand(...arguments);
        const focus = document.activeElement;
        if(!focus || !(focus instanceof HTMLInputElement)) {
            const selection = document.getSelection()?.toString();
            if(!selection)
                return document._execCommand(...arguments);
            handleCopy(selection);
            return;
        }
        const selection = focus.value.substring(focus.selectionStart, focus.selectionEnd);
        if(!handleCopy(selection))
            return document._execCommand(...arguments);
    }
    console.log("Privately Sharing!");
})();
