(function (){
    let burgerButton = document.querySelector('.menu_burger');
    let burgerMenu = document.querySelector('.menu_title-wrapper');
    
    burgerButton.addEventListener('click', burgerClass);
    
    function burgerClass() {
        burgerButton.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    };
    }) ();