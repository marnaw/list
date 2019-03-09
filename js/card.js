class Cards {
  constructor() {
    this.payment = []
    this.inputId = document.querySelector('#id-payment'); // get input id card
    this.inputAmount = document.querySelector('#amount'); // get input amount
    this.btn = document.querySelector('#btnAdd')
    this.tbody = document.querySelector('#table-content');
    this.cashier = document.getElementById('select-cashier');
    this.sum = document.querySelector('#sum-amount');
    this.date = null;
    document.querySelector('#search').addEventListener('input', this.searchCards.bind(this))
    document.querySelector('#print').addEventListener('click', this.printTable.bind(this));
    this.checkForm(this.inputId, this.inputAmount, this.btn, 'Błąd! Wpisz numer płatnośći!', 'Błąd! Wpisz kwotę!')
  }

  validation(button, text) {
    button.addEventListener('input', (e) => {
      button.classList.remove('is-error');
      button.placeholder = text;
      if (e.target.value.length > 0) {
        button.classList.add('is-active')
      } else {
        button.classList.remove('is-active')
      }
    })
  }

  checkForm(inputA, inputB, btn, textA, textB) { // inputA = inputId, inputB = inputAmount 
    this.validation(inputA, 'Wpisz numer płatności...')
    this.validation(inputB, 'Wpisz kwotę...')
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (inputA.value == '' || inputB.value == '') {
        inputA.classList.add('is-error');
        inputB.classList.add('is-error')
        inputA.placeholder = textA;
        inputB.placeholder = textB;
      } else {
        this.addCard(inputA.value, inputB.value, this.getDate())
        inputA.value = '';
        inputB.value = '';
        inputA.classList.remove('is-active');
        inputB.classList.remove('is-active');
      }
    })
  }
  addCard(idCard, amountCard, dateCard) {
    this.payment.push({
      id: idCard,
      amount: amountCard,
      date: dateCard
    })
    this.getCard(this.payment); // update table in DOM after add element to array
  }
  getCard(array) {
    this.tbody.innerHTML = ''
    array.forEach((value, index) => {
      const row = document.createElement('section');
      row.classList.add('table-content', 'table-content--color');

      row.dataset.row = index;
      row.innerHTML = `             
               <div class="table-content__wrapper">
                   <div class="table-content__row">
                       <div class="table-content__item" data-title="godzina:">${value.date}</div>
                       <div class="table-content__item" data-title="nr. płatności:">${value.id}</div>
                       <div class="table-content__item" data-title="kwota:">${value.amount} zł</div>
                       <div class="table-content__delete-icon">
                           <i class="fas fa-times-circle" data-icon=${index}></i>
                       </div>
                   </div>
               </div>

              `;
      this.sum.textContent = `Suma: ${this.sumAmount(array)} zł`;
      this.tbody.appendChild(row);


    })

    this.deleteCard();
    if (array.length > 0) {
      document.querySelector('.table-footer').style.display = "flex";
    } else {
      document.querySelector('.table-footer').style.display = "none";

    }

  }
  getDate() {
    this.date = new Date(); //get actual time
    let day = this.date.getDate();
    let month = this.date.getMonth() + 1;
    let hour = this.date.getHours();
    let minutes = this.date.getMinutes();
    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;
    if (hour < 10) hour = `0${hour}`;
    if (minutes < 10) minutes = `0${minutes}`;
    return day + '.' + month + '.' + this.date.getUTCFullYear() + '  ' + hour + ':' + minutes;
  }

  deleteCard() {
    const dataIcon = document.querySelectorAll('[data-icon]')
    const dataRow = document.querySelectorAll('[data-row]')
    dataIcon.forEach((icon) => {
      icon.addEventListener('click', function (e) {
        this.payment.splice(e.target.dataset.icon, 1);
        dataRow[e.target.dataset.icon].remove();
        this.getCard(this.payment) // update table in DOM
      }.bind(this))
    })

    const deleteAll = document.querySelector('#deleteAll');
    deleteAll.addEventListener('click', (e) => {
      this.payment.splice(0, this.payment.length);
      this.getCard(this.payment)
    })
    if (this.payment.length == 0) {
      this.sum.textContent = ''
    }
  }

  searchCards(e) {
    this.tbody.textContent = '';
    let task = this.payment.filter((element) => element.amount.includes(e.target.value))
    this.getCard(task) // update table in DOM
  }

  sumAmount(items) {
    let sum = items.reduce((prev, next) => {
      return parseFloat(prev) + parseFloat(next['amount']);
    }, 0)
    return sum.toFixed(2);
  }

  getCashier(id) {
    return id.options[id.selectedIndex].text;

  }
  getRaport(checkbox, text, sum) {
    let temp;
    if (document.querySelector(checkbox).checked) return temp = ''
    else return text + sum;

  }

  printTable(e) {
    var mywindow = window.open('', 'Print', 'height=600,width=800');
    mywindow.document.write(`<html><head><title>${this.getRaport('#checkbox_2','Karty z dnia: ',this.getDate())}</title>`);
    mywindow.document.write('</head><body>');
    const styleTh = `style="padding: 5px; border: 1px solid black;"`;
    const styleTable = `style="border-collapse: collapse; border-spacing: 0px;padding: 5px;border: 1px solid black;"`;
    const styleTd = `style="font-size: 12px; padding: 5px;border: 1px solid black;text-align:center"`;
    const styleTdLast = `style="padding: 5px;border: 0;text-align:right"`;
    mywindow.document.write(`
    <table ${styleTable}>
      <tr>
        <th ${styleTh}>Numer płatności</th>
        <th ${styleTh}>Kwota</th>
      </tr>
    `);
    this.payment.forEach(value => {
      mywindow.document.write(
        `<tr>
            <td ${styleTd}>
                    ${value.id}
            </td>
            <td ${styleTd}>
                    ${value.amount} zł
            </td>
         </tr>
        `)
    })
    mywindow.document.write(`
        <tr>
          <td ${styleTd}>
              ${this.getRaport('#checkbox_3','Ilość kart: ',this.payment.length)}
         </td>

          <td ${styleTd}>
               ${this.getRaport('#checkbox_4','SUMA: ',this.sumAmount(this.payment))} zł
          </td>
        </tr>
    </table>`)
    mywindow.document.write(this.getRaport('#checkbox_1', '<br>Kasjer: ', this.getCashier(document.querySelector('#select-cashier'))));
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus()
    mywindow.print();
    mywindow.close();
    return true;
  }
}
const cards = new Cards();