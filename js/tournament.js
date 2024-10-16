
const displayNumberPlayer = document.querySelectorAll('.numberLeft, .numberMid, .numberRight');





const displaySide = document.querySelectorAll('.bracketNameLeft, .bracketNameRight');
const SideRight = document.querySelector('.subTournamentSection');
const SideLeft = document.querySelector('.subTournamentSection2');


displayNumberPlayer.forEach(function(color)
{
    color.addEventListener('click', function() 
    {
        displayNumberPlayer.forEach(el => el.classList.remove('orange'));
        this.classList.add('orange');
    });

});

displaySide.forEach(function(color)
{
    color.addEventListener('click', function() 
    {
        displaySide.forEach(el => el.classList.remove('orange'));
        this.classList.add('orange');
        if (this.classList.contains('bracketNameRight')) 
        {
            SideRight.classList.add('hidden');
            SideLeft.classList.remove('hidden');
        } 
        else 
        {
            SideRight.classList.remove('hidden');
            SideLeft.classList.add('hidden');
        }
    });
});


