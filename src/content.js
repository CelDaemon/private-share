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
            case "x.com":
                handleTwitter(url);
                break;
        }
        return navigator.clipboard._writeText(url.href);
    }
    navigator.clipboard._writeText ??= navigator.clipboard.writeText;
    navigator.clipboard.writeText = async function(text) {
        handleCopy(text);
    }
    navigator.clipboard._write ??= navigator.clipboard.write;
    navigator.clipboard.write = async function(data) {
        console.log(data);
    }
    document._execCommand ??= document.execCommand;
    document.execCommand = function(cmd) {
        if(cmd !== "copy")
            return document._execCommand(arguments);
        const focus = document.activeElement;
        if(!focus || !(focus instanceof HTMLInputElement)) {
            const selection = document.getSelection()?.toString();
            if(!selection)
                return document._execCommand(arguments);
            handleCopy(selection);
            return;
        }
        const selection = focus.value.substring(focus.selectionStart, focus.selectionEnd);
        handleCopy(selection);
    }
    console.log("Privately Sharing!");
})();
