
  (function () {    
    function isPrime(num1) {
      if (typeof num1 !== 'number') throw 'Must provide a number';
      if (isNaN(num1)) throw 'Must provide a number';
      if (num1 < 1) {
        throw 'Number must be positive';
      }
      
      if (num1 === 1){
        throw'1 is neither prime nor composite';
      }
      
      for (let i = 2; i < num1; i++) {
        if (num1 % i == 0){
          return `is Not a prime number`; 
        }
      }
      return `is a prime number`;
    }

  const staticForm = document.getElementById('static-form');

  if (staticForm) {
    // We can store references to our elements; it's better to
    // store them once rather than re-query the DOM traversal each time
    // that the event runs.
    const firstNumberElement = document.getElementById('number1');
    const errorContainer = document.getElementById('error-container');
    const errorTextElement = errorContainer.getElementsByClassName(
      'text-goes-here'
    )[0];

    const resultContainer = document.getElementById('result-container');
    const resultTextElement = resultContainer.getElementsByClassName(
      'text-goes-here'
    )[0];

    let resultList = document.getElementById('attempts');
    // We can take advantage of functional scoping; our event listener has access to its outer functional scope
    // This means that these variables are accessible in our callback
    staticForm.addEventListener('submit', (event) => {
      event.preventDefault();

      try {
        // hide containers by default
        errorContainer.classList.add('hidden');
        resultContainer.classList.add('hidden');

        // Values come from inputs as strings, no matter what :(
        const firstNumberValue = firstNumberElement.value;
        const parsedFirstNumberValue = parseInt(firstNumberValue);
        const isPrimeResult = isPrime(parsedFirstNumberValue);
        const result = isPrimeResult;
        let li = document.createElement('li');
        li.innerHTML = parsedFirstNumberValue + " " + result.toString(); 
        
        // if(isPrime){
          if(result === "is a prime number"){
            li.className = 'is-prime';
            resultList.appendChild(li);
        } else{   
          li.className = 'not-prime';
          resultList.appendChild(li);
        }
        resultContainer.classList.remove('hidden');
      } catch (e) {
        const message = typeof e === 'string' ? e : e.message;
        errorTextElement.textContent = e;
        errorContainer.classList.remove('hidden');
      }    
    });
  }
})();
