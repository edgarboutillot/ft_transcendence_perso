


// const elements = document.querySelectorAll('.bracketNameLeft, .bracketNameRight');

// const disappearingDiv = document.querySelector('.tournamentSection1');
        
// elements.forEach(function(element) 
// {
//     element.addEventListener('click', function() 
//     {
//         elements.forEach(el => el.classList.remove('orange'));
//         this.classList.add('orange');

//         if (this.classList.contains('bracketNameRight')) {
//             tournamentSection1.classList.add('hidden');
//         } else {
//             tournamentSection1.classList.remove('hidden');
//         }
//     });
// });

const elements = document.querySelectorAll('.bracketNameLeft, .bracketNameRight');
const tournamentSection1 = document.querySelector('.tournamentSection1');

elements.forEach(function(element) {
    element.addEventListener('click', function() {
        // Remove 'orange' class from all elements
        elements.forEach(el => el.classList.remove('orange'));
        
        // Add 'orange' class to the clicked element
        this.classList.add('orange');

        // Check if the clicked element is RIGHT
        if (this.classList.contains('bracketNameRight')) 
        {
            tournamentSection1.classList.add('hidden');
        } 
        else 
        {
            tournamentSection1.classList.remove('hidden');
        }
    });
});