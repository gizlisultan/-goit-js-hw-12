

import axios from 'axios';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { galleryMarkup} from "./js/render-function.js";
import { URL , KEY } from "./js/pixabay-api.js";


const form = document.querySelector(".search-form")
const galleryUl = document.querySelector(".gallery")
const loader = document.querySelector('.loader')
const loadMoreBtn = document.querySelector('.load-btn');


const serverRequest = `${URL}?key=${KEY}`

const hiddenClass=  "is-hidden";
let searchItem = "";
let page = 1;
let maxPage = 0;



form.addEventListener("submit", searchImg)
loader.style.display = "none";


function searchImg(evt) {
    evt.preventDefault()
    loader.style.display = "block"
    searchItem = evt.currentTarget.elements.query.value;
    fetchPhoto(searchItem).then((data) => {
        loader.style.display = "none"
        if (!data.hits.length) {
            iziToast.error({
                title: "Error",
                message:
                    "Sorry, there are no images matching your search query. Please try again!",   
            }), loadMoreBtn.classList.add(hiddenClass)
        }
        galleryUl.innerHTML = "";
        page = 1;
        try {
               
        
            galleryUl.innerHTML = galleryMarkup(data.hits)
            const refreshPage = new SimpleLightbox(".gallery a", {
                captionsData: "alt",
                captionDelay: 250,
            });
            refreshPage.refresh(), scrollBy();
            if (data.totalHits >= 15) {
                loadMoreBtn.classList.remove(hiddenClass);
                loadMoreBtn.addEventListener("click", handleLoadMore);
            } else {
                loadMoreBtn.classList.add(hiddenClass);
            }

        }
        catch (err) { iziToast.error(err) } finally {
            form.reset();
            if (page === maxPage) {
                loadMoreBtn.classList.add(hiddenClass);
            }
        };
    },)
}

        function fetchPhoto(photo, page = 1) {
            return axios.get(`${URL}`, {
                params: {
                    key: KEY,
                    q: photo,
                    image_type: "photo",
                    orientation: "horizontal",
                    safesearch: true,
                    per_page: 15,
                    page,
                }
            }).then(({ data }) => data)
        }
        /*
            return fetch(`${serverRequest}&q=${photo}&image_type=photo&orientation=horizontal&safesearch=true`)
                .then((photo) => {
                    if (!photo.ok) {
                        throw new Error(photo.statusText)
                    }
                    return photo.json()
                }).catch((err) => console.log(err))
        }*/

        async function handleLoadMore() {
            page += 1;
 
            loadMoreBtn.disabled = true;
            try {
                const { hits, total } = await fetchPhoto(searchItem, page);

                maxPage = Math.ceil(total / 15);
    
    
                galleryUl.insertAdjacentHTML("beforeend", galleryMarkup(hits));
                const refreshPage = new SimpleLightbox(".gallery a", {
                 captionsData: "alt",
                  captionDelay: 250,
                 });
                refreshPage.refresh();
                scrollBy()
            } catch (error) {
                onFetchError(error);
            } finally {
  
                loadMoreBtn.disabled = false;
                if (page === maxPage) {
                    loadMoreBtn.classList.add(hiddenClass);
                    loadMoreBtn.removeEventListener("click", handleLoadMore)
                    iziToast.error({
                        title: "Error",
                        message:
                            "You've reached the end of search results.",
                    });
  
                }
            }
        }
 

        function scrollBy() {
            window.scrollBy({
                top: 700,
                behavior: 'smooth',
            });
        }