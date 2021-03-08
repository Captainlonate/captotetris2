class ImageLoader {
  /*
    imagesToLoad: {
      MyImage: 'images/dog.png',
      YourImage: 'images/house.png'
    },
    onDone: () => {}
  */
  constructor ({ imagesToLoad, onDone }) {
    this.images = {}
    this.numImagesRemaining = Object.keys(imagesToLoad).length
    this.onLoadedAll = onDone

    for (const [label, path] of Object.entries(imagesToLoad)) {
      this.loadOneImage({ label, path })
    }
  }

  loadOneImage ({ label, path }) {
    const img = new window.Image()
    img.src = path
    img.onload = () => {
      this.images[label] = img
      this.numImagesRemaining--
      if (this.numImagesRemaining === 0) {
        this.onLoadedAll()
      }
    }
  }

  getImage (label) {
    return this.images[label]
  }
}

export default ImageLoader
