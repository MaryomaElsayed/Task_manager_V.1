const user = "maryam";
let user_name = function () {
    document.getElementsByClassName('title')[0].innerHTML = `${user} tasks`;
};

user_name();

// Removed code related to the greeting paragraph
// The remaining code will only update the title element.
