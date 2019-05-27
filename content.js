const injectButton = () => {
    const actionButtonElement = document.querySelector('a.SingleTaskPaneExtraActionsButton.SingleTaskPaneToolbar-button');
    if (actionButtonElement) {
        const html = `
		    <a class="GithubButton CircularButton CircularButton--enabled CircularButton--medium CircularButton--borderless" tabindex="0" role="button" aria-disabled="false" aria-pressed="false">
		        <svg class="Icon MoreIcon" focusable="false" viewBox="0 0 12 16">
		            <path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path>
		        </svg>
		    </a>
	    `;
        const pullRequestButtonElement = (new DOMParser().parseFromString(html, 'text/html')).body.firstChild;

        pullRequestButtonElement.addEventListener('click', () => {
            if (pullRequestButtonElement.classList.contains('bounce')) {
                pullRequestButtonElement.classList.remove('bounce');
            }
            const myAudio = new Audio(chrome.runtime.getURL("multimedia.mp3"));
            myAudio.play();
            console.log('Create new Github PR :)');
        });

        const storage = window.localStorage;
        const isAcquainted = storage.getItem('isAcquainted');
        if (!isAcquainted) {
            pullRequestButtonElement.classList.add('bounce');
            storage.setItem('isAcquainted', 'True');
        }

        actionButtonElement.before(pullRequestButtonElement);
    }
};

let retries = 0;
const retriesLimit = 5;

const init = () => {
    const githubButton = document.querySelector('a.GithubButton');
    if (githubButton) {
        return console.log(`Github button already injected! Exiting...`);
    }

    const actionButtonElement = document.querySelector('a.SingleTaskPaneExtraActionsButton.SingleTaskPaneToolbar-button');
    if (actionButtonElement) {
        console.log(`Target element found! Injecting Github PR button...`);
        injectButton();
    } else if (retries < retriesLimit) {
        console.log(`Asana SingleTaskPaneToolbar element not found! Retrying in 1 sec...`);
        retries++;
        setTimeout(init, 1000);
    }
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'hello!') {
            console.log(request.url) // new url is now in content scripts!
            init();
        }
    });
