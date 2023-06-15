const loadFooter = () => {
    const footer = document.querySelector('.footer');
    const footerURL = '../components/footer.html';

    fetch(footerURL)
        .then(response => response.text())
        .then(data => {
            footer.innerHTML = data;
        });
}
loadFooter();