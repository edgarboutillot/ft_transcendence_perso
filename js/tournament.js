

// const option-btn = document.querySelectorAll('.option-btn');  //cursor
// const hideGlobal = document.querySelectorAll('.hiddenGlobal');   //hide global
// const hideLR = document.querySelector('.hiddenLR');        //hide left right
// const leftBtn = document.getElementById('leftbutton');
// const rightBtn = document.getElementById('rightbutton');


// function showTournament(shapeId) 
// {
//     hideGlobal.forEach(hiddenGlobal => hiddenGlobal.classList.remove('active'));
//     document.getElementById(shapeId).classList.add('active');
// }

// function handleOptionChange(value) 
// {
//     option-btn.forEach(btn => btn.classList.remove('active'));
//     document.getElementById(value).classList.add('active');
    
//     hiddenLR.style.display = value === '16' ? 'flex' : 'none';
    
//     switch(value) {
//         case '4':
//             showTournament('4display');
//             break;
//         case '8':
//             showTournament('816display');
//             break;
//         case '16':
//             showTournament('162display'); // Par défaut à gauche (cercle) pour 16
//             break;
//     }
// }

// option-btn.forEach(button => {
//     button.addEventListener('click', (event) => {
//         handleOptionChange(event.target.id);
//     });
// });


// handleOptionChange('4');


const optionButtons = document.querySelectorAll('.option-btn');
const shapes = document.querySelectorAll('.shape');
const nav16 = document.querySelector('.nav-16');

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');


function showShape(shapeId) 
{
    shapes.forEach(shape => shape.classList.remove('active'));
    document.getElementById(shapeId).classList.add('active');
}

function handleOptionChange(value) 
{
    optionButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(value).classList.add('active');
    
    nav16.style.display = value === '16' ? 'flex' : 'none';
    
    switch(value) {
        case '4':
            showShape('4display');
            break;
        case '8':
            showShape('816display');
            break;
        case '16':
            showShape('816display'); // Par défaut à gauche (cercle) pour 16
            break;
    }
}

optionButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        handleOptionChange(event.target.id);
    });
});

// leftBtn.addEventListener('click', () => showShape('816display'));
// rightBtn.addEventListener('click', () => showShape('162display'));


leftBtn.addEventListener('click', () => {
    showShape('816display');
    leftBtn.classList.add('active');
    rightBtn.classList.remove('active');
});

rightBtn.addEventListener('click', () => {
    showShape('162display');
    rightBtn.classList.add('active');
    leftBtn.classList.remove('active');
});

handleOptionChange('4');
