/**
 * Created by liuxinhua on 16/1/2.
 */


$(document).ready(function () {
    //$('div#reject').hide()
    var $verify = $('input[type="radio"]')
    //alert($verify.val())
    if ($verify.val() == '3') {
        $('textarea').prop('required',false)
        $('div#reject').hide()
    } else {
        alert(2)
        $('textarea').prop('required',true)
        $('div#reject').show()
    }

    $('input[type="radio"]').change(function () {
        if (this.value == '3') {
            $('textarea').prop('required',false)
            $('div#reject').hide()
        } else {
            $('textarea').prop('required',true)
            $('div#reject').show()
        }
    })

})