$(window).ready(function() {
    //Set Tmp User Id
    window.userId = Math.floor((Math.random()*100000000000000000)+1);

    //Set Array of Users
    window.users = new Array();

    //Set Array of User Lines
    window.cursors = new Array();

	setTimeout(function() { sidebar('find'); }, 100)
});