$(document).ready(function() {
  const $tableID = $('#table');
  const $BTN = $('#export-btn');
  const $EXPORT = $('#export');

  const newTr = `
    <tr>
      <td class="pt-3-half text-center">1</td>
      <td class="pt-3-half text-center" contenteditable="true"></td>
      <td class="pt-3-half text-center" contenteditable="true"></td>
      <td class="pt-3-half" contenteditable="true"></td>
      <td class="text-center">
        <span class="table-remove">
          <button type="button" class="btn btn-light no-radius btn-sm">Remove</button>
        </span>
      </td>
    </tr>`;

  var table_index = 2;

  $('.table-add').on('click', 'button', () => {
    // alert($tableID.find('tr').length);
    if ($tableID.find('tr').length === 1) {
      $('tbody').append(newTr);
    }
    else{
      const addTr = newTr.replace('1', table_index);
      table_index = table_index + 1
      $tableID.find('table').append(addTr);
    }
  });


  $tableID.on('click', '.table-remove', function() {
    $(this).parents('tr').detach();
    // alert(table_index);
    table_index = table_index - 1;


  });



 // // A few jQuery helpers for exporting only
 // jQuery.fn.pop = [].pop;
 // jQuery.fn.shift = [].shift;

 // $BTN.on('click', () => {

 //   const $rows = $tableID.find('tr:not(:hidden)');
 //   const headers = [];
 //   const data = [];

 //   // Get the headers (add special header logic here)
 //   $($rows.shift()).find('th:not(:empty)').each(function () {

 //     headers.push($(this).text().toLowerCase());
 //   });

 //   // Turn all existing rows into a loopable array
 //   $rows.each(function () {
 //     const $td = $(this).find('td');
 //     const h = {};

 //     // Use the headers from earlier to name our hash keys
 //     headers.forEach((header, i) => {

 //       h[header] = $td.eq(i).text();
 //     });

 //     data.push(h);
 //   });

 //   // Output the result
 //   $EXPORT.text(JSON.stringify(data));
 // });
});