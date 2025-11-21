(function() {
    const REDDIT_POST_REGEX = /^\/r\/[^/]+\/comments\/(\w+)\/[^/]+\/$/;
    function handleReddit(url) {
        const match = REDDIT_POST_REGEX.exec(url.pathname);
        if(!match)
            return;
        url.href = `https://redd.it/${match[1]}`;
    }
    const TWITTER_STATUS_REGEX = /^\/[^/]+\/status\/\d+$/;
    function handleTwitter(url) {
        url.searchParams.delete("s");
        if(!TWITTER_STATUS_REGEX.test(url.pathname))
            return;
        url.host = "fixupx.com";
    }
    function handleTiktok(url) {
        url.searchParams.delete("is_from_webapp");
        url.searchParams.delete("sender_device");
        url.searchParams.delete("web_id");
    }
    function handleInstagram(url) {
        url.searchParams.delete("igsh");
    }
    const GENERAL_REGEX = /^(si)|(utm_.+)$/;
    function handleGeneral(url) {
        for(const key of [...url.searchParams.keys().filter(key => GENERAL_REGEX.test(key))])
            url.searchParams.delete(key);
    }
    function handleCopy(text) {
        const URL_REGEX = /(http|https):\/\/[^\s]+/
        text = text.replace(URL_REGEX, (text) => {
            const url = URL.parse(text);
            if(!url)
                return text;
            handleGeneral(url);
            switch(url.host) {
                case "www.reddit.com":
                    handleReddit(url);
                    break;
                case "x.com":
                    handleTwitter(url);
                    break;
                case "www.tiktok.com":
                    handleTiktok(url);
                    break;
                case "www.instagram.com":
                    handleInstagram(url);
                    break;
            }
            return url.href;
        })
        return navigator.clipboard._writeText(text);
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
