import { formatDate } from '@angular/common';

class FormatService {

    formatNumber(n) {
        // format number 1000000 to 1,000,000
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    
    formatCurrency(n) {
        // appends $ to value, validates decimal side
        // and puts cursor back in right position.
    
          var input_val = n
    
    
        // don't validate empty input
        if (input_val === "" || input_val === undefined) { return; }
    
        // // original length
        // var original_len = input_val.length;
    
        // // initial caret position 
        // var caret_pos = input.selectionStart;
    
        // check for decimal
        if (input_val.indexOf(".") >= 0) {
    
          // get position of first decimal
          // this prevents multiple decimals from
          // being entered
          var decimal_pos = input_val.indexOf(".");
    
          // split number by decimal point
          var left_side = input_val.substring(0, decimal_pos);
          var right_side = input_val.substring(decimal_pos);
    
          // add commas to left side of number
          left_side = this.formatNumber(left_side);
    
          // validate right side
          right_side = this.formatNumber(right_side);
    
          // On blur make sure 2 numbers after decimal
    
          // Limit decimal to only 2 digits
          right_side = right_side.substring(0, 2);
    
          // join number by .
          input_val = left_side + "." + right_side;
    
        } else {
          // no decimal entered
          // add commas to number
          // remove all non-digits
          input_val = this.formatNumber(input_val);
          input_val = input_val;
        }
    
        return input_val
      }

    formatDateTime(date){
        return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en');
    }
    
}

export default new FormatService()