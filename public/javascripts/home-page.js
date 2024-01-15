(() => {

    // Useful global variables

    const NASAAPIKEY = 'ZGKJfGR0E2jUlWtd4yDqgMNfFVFFvaK6mfWOapiK';
    const APOD_URL = 'https://api.nasa.gov/planetary/apod?';

    let CURRENT_DATE;
    let dateTimePicker;
    let goBtn;
    let picturesSection;
    let picturesRow;
    let popOutSection;

    /**
     * Closure that contains a general useful functions
     * @type {{setDateTime: setDateTime, initializeVariables: initializeVariables}}
     */
    const utilities = (function () {

        /**
         * Initialize the global variables
         * @type {initializeVariables}
         */
        const initializeVariables = () => {
            CURRENT_DATE = new Date().toJSON().slice(0, 10);
            dateTimePicker = document.getElementById('datePicker');
            goBtn = document.getElementById('goBtn');
            picturesSection = document.getElementById('pictures-container');
            picturesRow = document.getElementById('picturesRow');
            popOutSection = document.querySelector('.pop-out');
        }

        /**
         * Sets the dateTimePicker values
         */
        const setDateTime = () => {
            dateTimePicker.value = CURRENT_DATE;
            dateTimePicker.setAttribute('max', CURRENT_DATE);
        }

        /**
         * Checks fetches status
         * @param response
         * @returns {Promise<never>|Promise<unknown>}
         */
        function fetchStatus(response) {
            if (response.ok)
                return Promise.resolve(response);
            else
                return Promise.reject(new Error(response.statusText));
        }

        /**
         * Creates a html element according to the parameters
         * @param tag - html tag to create
         * @param classes - the classes to add to the element
         * @param contents - the contents (others elements or text) to add to the element
         * @param attributes - attributes (and their values) to add to the element
         * @returns the element created
         */
        function elemFactory(tag, classes = [], contents = [], attributes = {}) {
            const element = document.createElement(tag);

            classes.forEach(cls => element.classList.add(cls));

            contents.forEach(elm => element.appendChild(elm));

            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });

            return element;
        }

        return {
            initializeVariables: initializeVariables,
            setDateTime: setDateTime,
            fetchStatus: fetchStatus,
            elemFactory: elemFactory
        }

    })()

    /**
     * Closure that responsible on the connection with the nasa api
     */
    const nasaApi = (function () {

        let nasaData;

        /**
         * Gets the data from the NASA api
         */
        const fetchNasaData = async function () {

            // prevent fetching when the there's no starting date
            if (getDateSelection() === '')
                return;

            let fetchUrl = getNasaApiUrl();

            await fetch(getNasaApiUrl())
                .then(utilities.fetchStatus)
                .then(res => res.json())
                .then(imageHandler.displayImages)
                .catch(handleFetchError)
        }

        /**
         * Returns the URL for the nasa fetch request
         * @returns {string} - the built URL
         */
        function getNasaApiUrl() {

            // gets the current date in format 'YYYY-MM-DD'
            CURRENT_DATE = new Date().toJSON().slice(0, 10);

            let params = new URLSearchParams({
                start_date: getDateSelection(),
                end_date: CURRENT_DATE,
                api_key: NASAAPIKEY
            });

            return APOD_URL + params;
        }

        /**
         * Returns the starting date from the user selection
         */
        const getDateSelection = function () {
            return dateTimePicker.value;
        }

        const handleFetchError = function (error) {
            console.log(error);
        }

        return {
            fetchNasaData: fetchNasaData
        }

    })();

    /**
     * Closure that responsible on the NASA data displaying
     */
    const imageHandler = (function () {

        // holds the data that came from the NASA api
        let imagesData;

        // icon awesome classes
        let heartIconClasses = ['fa-regular', 'fa-heart'];
        let messageIconClasses = ['fa-regular', 'fa-message'];
        let arrowIconClasses = ['fa-solid', 'fa-arrow-right'];

        // Number of image needs to be load
        let imgLimit;
        // Number of image added every load
        const imgIncreased = 8;
        // Number of total pages
        let pageCount;
        // The current page to load
        let currentPage;
        // The current image index
        let imgIndex;
        // Boolean timer for the throttle function
        let throttleTimer;

        /**
         * Displaying the images
         */
        const displayImages = function (data) {

            imagesData = data.reverse();

            // reset the data
            picturesRow.innerHTML = '';

            // add event listener

            defineScroll(imagesData.length);

            loadFirstPage();
            // loop through all the data elements
            // data.reverse().forEach((value, index) => {
            //     picturesRow.appendChild(createImageCol(value, index));
            // });
        }

        /**
         * Sets the parameters of the scrolling
         * @param limit
         */
        const defineScroll = function (numImgs) {
            imgLimit = numImgs;
            pageCount = Math.ceil(imgLimit / imgIncreased);
            currentPage = 1;
            imgIndex = 0;
        }

        /**
         * Loads the first page of images
         */
        const loadFirstPage = function () {
            addImages(currentPage);
            window.addEventListener("scroll", handleInfiniteScroll);
        }

        /**
         *
         * @param pageIndex
         */
        const addImages = function (pageIndex) {
            currentPage = pageIndex;
            const startRange = (pageIndex - 1) * imgIncreased;
            const endRange = currentPage === pageCount ? imgLimit : pageIndex * imgIncreased;
            for (let i = startRange + 1; i <= endRange; i++) {
                picturesRow.appendChild(createImageCol(imagesData[imgIndex], imgIndex++));
            }
        }

        const throttle = (callback, time) => {
            if (throttleTimer) return;
            throttleTimer = true;
            setTimeout(() => {
                callback();
                throttleTimer = false;
            }, time);
        };

        const handleInfiniteScroll = () => {
            throttle(() => {
                const endOfPage =
                    window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 5;
                if (endOfPage) {
                    addImages(currentPage + 1);
                }
                if (currentPage === pageCount) {
                    removeInfiniteScroll();
                }
            }, 1000);
        };

        const removeInfiniteScroll = () => {
            //loader.remove();
            window.removeEventListener("scroll", handleInfiniteScroll);
        };


        /**
         * Creates the col that contains the image container
         * @param imgIndex
         * @returns {*} the created element
         */
        const createImageCol = function (imgData, imgIndex) {
            let imgContainer = createImageContainer(imgData, imgIndex);
            return utilities.elemFactory(
                'div',
                ['col-sm-6', 'col-xl-3'],
                [imgContainer],
                {
                    'style': 'justify-content: center; display: flex;'
                }
            );
        }

        /**
         * Creates the image container that contains the image and the message button
         * @param imgIndex
         * @returns {*} the created element
         */
        const createImageContainer = function (imgData, imgIndex) {
            let image = createImageDiv(imgData['url']);
            let btn = createMessageBtn(imgIndex);

            // Trigger the popOut effect and start the comments polling
            btn.addEventListener('click', (event) => {
                popOut(event);
                commentsHandler.setPolling()
            });
            // btn.addEventListener('click', ()=> { popOut(); commentsHandler.setPolling() });

            return utilities.elemFactory(
                'div',
                ['image-container'],
                [image, btn],
                {'data-img-index': `${imgIndex}`, 'style': 'max-width: 250px'});
        }

        /**
         * Creates the element that contains the image and the heart icon
         * @param imageUrl
         * @returns {*} the created element
         */
        const createImageDiv = function (imageUrl) {
            let image = utilities.elemFactory('img', [], [], {'src': imageUrl})
            let heartIcon = utilities.elemFactory('i', heartIconClasses);
            return utilities.elemFactory(
                'div',
                ['image'],
                [image, heartIcon]);
        }

        /**
         * Creates the messages button element
         * @returns {*} the created element
         */
        const createMessageBtn = function (imgIndex) {
            let messageIcon = utilities.elemFactory('i', messageIconClasses);
            let text = document.createTextNode('Messages');
            return utilities.elemFactory(
                'div',
                ['btn', 'messagesBtn'],
                [text, messageIcon],
                {'data-img-index': `${imgIndex}`});
        }

        /**
         * Creates the pop out effect with the selected picture
         * @param event
         */
        const popOut = function (event) {
            let imgUrl;
            let imgId;
            let index = event.currentTarget.dataset.imgIndex;

            // let targetObject = imagesData.reverse()[index];
            let targetObject = imagesData[index];

            if (targetObject) {
                imgUrl = targetObject.url;
                imgId = targetObject.date;
            } else {
                console.log('Object with specified id not found');
                // need to implement !
            }

            // reset the sections
            popOutSection.innerHTML = '';

            popOutSection.appendChild(createPopOutContainer(imgUrl, imgId));
            popOutSection.classList.toggle('d-none');
        }

        const createPopOutContainer = function (imgUrl, imgId) {
            let image = createImageDiv(imgUrl);
            let commentsBtn = createPopOutCommentsBtn(imgId);
            commentsBtn.addEventListener('click', (event) => {
                event.currentTarget.parentElement.classList.toggle('active')
            });
            let collapse = createCommentsCollapse(imgId);

            let container = utilities.elemFactory(
                'div',
                ['image-container'],
                [image, commentsBtn, collapse],
                {
                    'data-img-index': `${imgId}`
                });

            container.addEventListener('click', (event) => {
                event.stopPropagation();
            })

            return container;
        }

        /**
         * Creates the pop out's comments button
         * @param imgId
         * @returns {*}
         */
        const createPopOutCommentsBtn = function (imgId) {
            let messageIcon = utilities.elemFactory('i', messageIconClasses);
            let text = document.createTextNode('Comments');
            return utilities.elemFactory(
                'Button',
                ['btn'],
                [text, messageIcon],
                {
                    'data-img-id': `${imgId}`, 'type': 'button', 'data-bs-toggle': 'collapse',
                    'data-bs-target': '#commentsCollapse', 'aria-expanded': 'false', 'aria-controls': 'messagesCollapse'
                });
        }

        /**
         * Creates the collapse that contains the comments
         * @param imgId
         * @returns {*}
         */
        const createCommentsCollapse = function (imgId) {
            let text = document.createTextNode('comment');
            let messageForm = createMessageForm(imgId);
            messageForm.addEventListener('submit', commentsHandler.submitComment);

            let commentsCards = utilities.elemFactory(
                'div',
                ['commentsCards'],
                [],
                {
                    'id': 'commentsCards'
                });

            return utilities.elemFactory(
                'div',
                ['collapse'],
                [messageForm, commentsCards],
                {
                    'id': 'commentsCollapse',
                    'data-img-id': `${imgId}`,
                    'data-last-update': ''
                });
        }

        const createMessageForm = function (imgId) {
            let textArea = createTextArea();
            let messagePostBtn = createPostBtn();

            let div = utilities.elemFactory(
                'div',
                ['d-flex', 'flex-row', 'align-items-center', 'gap-3'],
                [textArea, messagePostBtn])

            // For the img id
            let hiddenInput = utilities.elemFactory('input', [], [],
                {'type': 'hidden', 'name': 'imgId', 'value': `${imgId}`})

            return utilities.elemFactory(
                'form',
                [],
                [hiddenInput, div],
                {
                    'action': '/comments/addComment',
                    'method': 'POST',
                    'id': 'commentsForm'
                });
        }

        const createTextArea = function () {
            return utilities.elemFactory(
                'textarea',
                [],
                [],
                {
                    'id': 'commentTextArea', 'name': 'commentText',
                    'placeholder': 'Type here...',
                    'style': 'width: -webkit-fill-available;max-width: 500px;' +
                        ' padding: 10px;color: white;background: #080A12FF; border: 1px solid rgb(0, 114, 108);'
                })
        }

        const createPostBtn = function () {
            let arrowIcon = utilities.elemFactory('i', arrowIconClasses, [], {
                'style': 'position: absolute; font-size: 25px; top: 50%; left: -2px; transform: translateY(-50%);'
            });

            return utilities.elemFactory(
                'button',
                ['btn'],
                [arrowIcon],
                {
                    'type': 'submit',
                    'style': 'position: relative; width: 40px; height: 30px;'
                });
        }

        return {
            displayImages: displayImages,
            popOut: popOut
        }

    })()

    /**
     * Closure that responsible on the comments handling
     */
    const commentsHandler = (function () {

        let commentsCollapse;
        let commentsCards;
        let intervalId;

        let trashIconClasses = ['fa-solid', 'fa-trash'];

        /**
         * Submit the form comment to the server
         * @param event
         * @returns {Promise<void>}
         */
        const submitComment = async function (event) {
            event.preventDefault();

            const imgId = event.target.imgId.value.trim();
            const comment = event.target.commentText.value.trim();

            try {
                const response = await fetch('/comments/addComment', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({imgId, comment}),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    // Reset the textArea after successful submission
                    document.getElementById('commentTextArea').value = '';
                } else {
                    console.error('Failed to add comment:', response.statusMessage);
                }
            } catch (e) {
                console.error('Error adding comment:', e);
            }
        }

        /**
         * Trigger the timeOut for the comments polling
         */
        const setPolling = function () {
            // Set the object that needs to be updated
            commentsCollapse = document.getElementById('commentsCollapse');
            commentsCards = document.getElementById('commentsCards');

            const imgId = commentsCollapse.dataset.imgId;

            // Update the comments for the first time (and set first update time)
            getImgComments(commentsCollapse.dataset.imgId)
                .then(() => {
                    intervalId = setInterval(isNewComments, 3 * 1000, imgId);
                });
        }

        /**
         * Cancel the timeOut for the polling
         */
        const clearPolling = function () {
            clearInterval(intervalId);
        }

        /**
         * Check if there is new comments in the server
         * @param imgId
         */
        const isNewComments = async function (imgId) {
            console.log('Polling...');

            const lastUpdate = getLastUpdateTime();
            const url = `/comments/isNewComments?imgId=${imgId}&lastUpdate=${lastUpdate}`;

            try {
                const response = await fetch(url)

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    // If there's new, get them
                    if (data.isNew)
                        await getImgComments(imgId);

                } else {
                    console.error('Failed to check for new comment', response.statusMessage);
                }
            } catch (e) {
                console.error('Error occurred while connecting server:', e);
            }
        }

        /**
         * The last time that the comments collapse has been updated
         * @returns {string}
         */
        const getLastUpdateTime = function () {
            return commentsCollapse.dataset.lastUpdate;
        }

        const getImgComments = async function (imgId) {
            const url = `/comments/getComments?imgId=${imgId}`;
            let data;

            fetch(url)
                .then(utilities.fetchStatus)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const comments = data.comments;

                        console.log('Comments:', comments);
                        displayComments(comments);
                    } else {
                        console.log('Comments:', 'no comments found');

                    }
                })
                .catch(error => {
                    // Handle fetch error
                    console.error('Error fetching comments:', error);
                });

            // Set the last update time
            commentsCollapse.dataset.lastUpdate = new Date().toJSON().slice(0, 19);

            // Display data
        }

        /**
         * Displaying the comments in the comments collapse
         * @param data - comments data
         */
        const displayComments = function (data) {
            // Reset the old comments (Should be change to update...)
            commentsCards.innerHTML = '';

            data.forEach(comment => {
                commentsCards.appendChild(createCommentDiv(comment));
            })
        }

        const createCommentDiv = function (comment) {
            let trashIcon = utilities.elemFactory('i', trashIconClasses, [],
                {'data-img-id': `${comment.imgId}`, 'data-comment-id': `${comment.id}`});
            trashIcon.addEventListener('click',deleteComment);

            let author = utilities.elemFactory(
                'p',
                ['d-flex']).appendChild(document.createTextNode(`author: ${comment.userName}`));

            let content;
            if (comment.isOwner)
                content = [author, trashIcon];
            else
                content = [author];

            let commentDetails = utilities.elemFactory(
                'div',
                ['commentDetails', 'd-flex', 'flex-col', 'justify-content-between'],
                content);

            let text = document.createTextNode(`${comment.text}`);

            let commentText = utilities.elemFactory(
                'div',
                ['commentText'],
                [text]);

            return utilities.elemFactory(
                'div',
                ['card', 'card-body'],
                [commentDetails, commentText]);
        }

        const deleteComment = async function (event) {
            event.stopPropagation();

            let imgId = event.currentTarget.dataset.imgId;
            let commentId = event.currentTarget.dataset.commentId;

            let toRemove = event.target;

            try {
                const response = await fetch('/comments/deleteComment', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({imgId, commentId}),
                });

                if (response.ok) {
                    // const data = await response.json();
                    toRemove.parentElement.parentElement.remove();
                    console.log('Comment deleted successfully');
                } else {
                    console.error('Failed to deleted  comment:', response.statusMessage);
                }
            } catch (e) {
                console.error('Error deleting comment:', e);
            }

        }

        return {
            submitComment: submitComment,
            setPolling: setPolling,
            clearPolling: clearPolling
        }

    })()

    /**
     * upon loading the page, we bind listeners to certain objects
     */
    document.addEventListener("DOMContentLoaded", () => {


        window.addEventListener('load', function () {

            utilities.initializeVariables();
            utilities.setDateTime();
            goBtn.addEventListener('click', nasaApi.fetchNasaData);
            popOutSection.addEventListener('click', () => {
                commentsHandler.clearPolling();
                popOutSection.classList.toggle('d-none');
            })

        }, false);


    });


})();