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
    $(".view-toggler").click(() => {
        console.log("Button was clicked");

        $('.skill-box').toggleClass("border")
        $('.skill-box > div').toggleClass("rect-box circle-box");
        $('.skill-box > div > span').toggleClass("rounded-pill");

        // Making functionality for the skill section
        let span = document.querySelectorAll(".rect-box span");

        span.forEach(element => {
            element.style.width = `${element.parentNode.getAttribute("data-filled")}`;
        })
        
        // Making skills section for circular view
        $(".circle-box").css({ background: `conic-gradient(#0d6efd 0 ${$(".circle-box").data("filled")} , gray ${$(".circle-box").data("filled")} 360deg)` })

    })




});