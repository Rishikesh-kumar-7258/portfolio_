// JQuery is written here
$(function(){
    const titles = $('header p').data('title').split(", ");

    // Making writing animation in header
    let i = 0, j = 0;
    let text = "", back = false;
    setInterval(() => {
        $('header p').html(`I am a <span class="text-decoration-underline text-primary fw-bold">${text}</span>`)
        if (back)
        {
            text = text.substring(0, text.length-1);
            i--;
            if (i < 0)
            {
                back = false;
                j = (j + 1) % titles.length;
                i = 0;
            }
        }
        else{
            text += titles[j][i];
            i++;
            if (i >= titles[j].length){
                back = true;
            }
        }
    }, 300);


});