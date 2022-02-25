export default function DownloadImages() {

    const btn = document.getElementById('downloadImage');
    const url = "https://i.guim.co.uk/img/media/c5e73ed8e8325d7e79babf8f1ebbd9adc0d95409/2_5_1754_1053/master/1754.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=b6ba011b74a9f7a5c8322fe75478d9df";

    btn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('ABC')
    downloadImage(url);
})


function downloadImage(url) {
  fetch(url, {
    mode : 'no-cors',
  })
    .then(response => response.blob())
    .then(blob => {
    let blobUrl = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.download = 'image file name here';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  })
}

}
