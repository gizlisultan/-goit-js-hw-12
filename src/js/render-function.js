function galleryMarkup(arr) {
    return arr
        .map(
            ({ webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads, }) => `
  <li class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}">
    <img
      class="gallery-image"
      src="${webformatURL}"
      alt="${tags}"
    />
    <p class= "gallery-descr">• Likes: ${likes} • Views: ${views} • Comments: ${comments} •</span> Downloads:${downloads}</p>
  </a>
</li>
  `)
    .join("")
}

export { galleryMarkup };