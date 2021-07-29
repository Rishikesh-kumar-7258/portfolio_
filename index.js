// JQuery is written here
$(function () {
    const titles = $('header p').data('title').split(", ");

    // Making writing animation in header
    let i = 0, j = 0;
    let text = "", back = false;
    setInterval(() => {
        $('header p').html(`I am a <span class="text-decoration-underline text-primary fw-bold">${text}</span>`)
        if (back) {
            text = text.substring(0, text.length - 1);
            i--;
            if (i < 0) {
                back = false;
                j = (j + 1) % titles.length;
                i = 0;
            }
        }
        else {
            text += titles[j][i];
            i++;
            if (i >= titles[j].length) {
                back = true;
            }
        }
    }, 300);

    //Toggling the view for rectangle and circular boxes
    is_circle = false;
    $(".view-toggler").click(() => {

        is_circle = !is_circle;

        $('.skill-box').toggleClass("border")
        $('.skill-box > div').toggleClass("rect-box circle-box");
        $('.skill-box > div > span').toggleClass("rounded-pill");

        fill();

        // Making skills section for circular view
        if (is_circle) {
            let circles = document.querySelectorAll(".circle-box");

            circles.forEach((element) => {
                element.style.background = `conic-gradient(#0d6efd 0 ${element.getAttribute("data-filled")} , lightblue ${element.getAttribute("data-filled")} 360deg)`;
            })
        }
        else $(".rect-box").css({ background: "none" });

    })

    // submitting form
    $('form').submit(function()
    {
        alert("form is submittted");
        let name = $("#name").val();
        let email = $("#email").val();
        let phone = $("#phone").val();
        let message = $("#message").val();

        console.log(name, email, phone, message);

        return false;
    })

    // Making toggle button work
    $(".nav-toggler").click(() => {
        $("nav").toggleClass('hide');
    })

});

// Making functionality for the skill section
function fill() {
    let span = document.querySelectorAll(".rect-box span");
    let rect = document.querySelectorAll(".rect-box");

    rect.forEach((element) => {
        element.style.background = "none";
    })

    span.forEach(element => {
        element.style.width = `${element.parentNode.getAttribute("data-filled")}`;
    })

}

fill();

// Toggle navbar
const nav_toggle = document.querySelector(".nav-toggler");
const nav = document.querySelector("nav");
const section = document.querySelectorAll("section");
const header = document.querySelector("header");

let is_nav_visible = innerWidth > 780 ? true : false;
window.addEventListener('resize', responsive)

function responsive()
{
    if (innerWidth > 780) 
    {
        nav_toggle.classList.add("hide");
        section.forEach(element => {
            element.classList.add("p-5");
        })
        header.classList.add("px-5");
        if (!is_nav_visible)
        {
            nav.classList.remove("hide");
            is_nav_visible = true;
        }
    }
    else
    {
        nav_toggle.classList.remove("hide");
        section.forEach(element => {
            element.classList.remove("p-5");
        })
        header.classList.remove("px-5");
        if (is_nav_visible)
        {
            nav.classList.add("hide");
            is_nav_visible = false;
        }
    }
}

responsive();