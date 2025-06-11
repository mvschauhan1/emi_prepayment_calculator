const emiBtn = document.getElementById("calculate");
const emiCalculated = document.getElementById("emi_calculated");
const prepaymentBtn = document.getElementById("calculate_new_emi_tenure");
const recalculatedEmiORTenure = document.getElementById("recalculated_emi_or_tenure");
const emiChartDisplay = document.getElementById("emi_chart");
const revisedEmiChartDisplay = document.getElementById("revised_emi_chart");
const flatCheckbox = document.getElementById("flat");
const tenureOption = document.getElementById("tenure_reduction");
const tenureOptionLabel = document.getElementById("label_tenure_reduction");

let hideFeature = function () {
    if (flatCheckbox.checked === true) {
        tenureOption.style.display = 'none';
        tenureOptionLabel.style.display = 'none';
    } else {
        tenureOption.style.display = ''; 
        tenureOptionLabel.style.display = '';
    }
};


flatCheckbox.addEventListener('change', hideFeature);


hideFeature();

const calculateEMIFlat = function () {
    const loanAmt = parseFloat(document.getElementById("loan_amount").value);
    const int = parseFloat(document.getElementById("interest_rate").value);
    const tenure = parseInt(document.getElementById("tenure").value);

    const totalInterest = ((loanAmt * int * (tenure / 12)) / 100);
    const totalRepayment = + totalInterest + loanAmt;
    const emi = totalRepayment / tenure;
    emiCalculated.textContent = `EMI: Rs. ` + emi.toFixed(2);

    let remainingLoanBalance = loanAmt;
    let cumulativePrincipalPaid = 0;

    emiChartDisplay.innerHTML = '';

    const flatInterestPerMonth = (loanAmt * int) / 100 / 12;

    for (let i = 1; i <= tenure; i++) {
        let interestPaid = flatInterestPerMonth;
        let principalPaid = emi - interestPaid;
        remainingLoanBalance -= principalPaid;
        cumulativePrincipalPaid += principalPaid;
        let percentageOfLoanPaid = (cumulativePrincipalPaid / loanAmt) * 100;

        let row = `
            <tr>
                <td>${i}</td>
                <td>₹${emi.toFixed(2)}</td>
                <td>₹${interestPaid.toFixed(2)}</td>
                <td>₹${principalPaid.toFixed(2)}</td>
                <td>₹${remainingLoanBalance.toFixed(2)}</td>
                <td>₹${cumulativePrincipalPaid.toFixed(2)}</td>
                <td>${percentageOfLoanPaid.toFixed(2)}%</td>
            </tr>
        `;
        
        emiChartDisplay.innerHTML += row; 
    }
}

const calculatePrepaymentBenefitsFlat = function() {
    const loanAmt = parseFloat(document.getElementById("loan_amount").value);
    const int = parseFloat(document.getElementById("interest_rate").value);
    const tenure = parseInt(document.getElementById("tenure").value);
    const loanEmisPaid = parseInt(document.getElementById("loan_emis_paid").value);
    const amountToBePrepaid = parseFloat(document.getElementById("prepayment_amount").value);
    const emiOption = document.getElementById("emi_reduction");
    // const tenureOption = document.getElementById("tenure_reduction");
    // const originalEmisOutstanding = document.getElementById("emis_originally_outstanding");
    const recalculatedEmiORTenure = document.getElementById("recalculated_emi_or_tenure");

    const totalInterest = ((loanAmt * int * (tenure / 12)) / 100);
    const totalRepayment = totalInterest + loanAmt;
    let emi = totalRepayment / tenure;

    if (emiOption.checked) {
        const interestPaidAlready = (loanEmisPaid * (loanAmt * (int / 100 / 12)));
        const newInterest = totalInterest - interestPaidAlready;
        const remainingPrincipal = totalRepayment - (emi * loanEmisPaid) - newInterest;
        const newPrincipal = remainingPrincipal - amountToBePrepaid;
        const newTotalRepayment = newPrincipal + newInterest;
        const reducedEmi = newTotalRepayment / (tenure - loanEmisPaid);
    
        recalculatedEmiORTenure.textContent = `Reduced EMI: Rs. ${reducedEmi.toFixed(2)}`;
    
        let remainingLoanBalance = newPrincipal;
        let cumulativePrincipalPaid = 0;
        let emiChartHTML = '';
    
        for (let i = 1; i <= (tenure - loanEmisPaid); i++) {
            let interestPaid = (loanAmt * int) / 100 / 12;
            let principalPaid = reducedEmi - interestPaid;
            remainingLoanBalance -= principalPaid;
            cumulativePrincipalPaid += principalPaid;
            let percentageOfLoanPaid = (cumulativePrincipalPaid / newPrincipal) * 100;
    
            if (i === (tenure - loanEmisPaid)) {
                principalPaid = reducedEmi - interestPaid;
                remainingLoanBalance = 0;
            } 
            
    
            emiChartHTML += `
                <tr>
                    <td>${i}</td>
                    <td>₹${reducedEmi.toFixed(2)}</td>
                    <td>₹${interestPaid.toFixed(2)}</td>
                    <td>₹${principalPaid.toFixed(2)}</td>
                    <td>₹${remainingLoanBalance.toFixed(2)}</td>
                    <td>₹${cumulativePrincipalPaid.toFixed(2)}</td>
                    <td>${percentageOfLoanPaid.toFixed(2)}%</td>
                </tr>
            `;
        }
        revisedEmiChartDisplay.innerHTML = emiChartHTML;
    }   
    // else if (tenureOption.checked) {
    //     const interestPaidAlready = (loanEmisPaid * (loanAmt * (int / 100 / 12)));
    //     const remainingPrincipal = totalRepayment - (emi * loanEmisPaid) - interestPaidAlready;
    //     const newPrincipal = remainingPrincipal - amountToBePrepaid;
        
    //     const flatInterestPerMonth = (loanAmt * int) / 100 / 12; 
    //     let copiedEmi = emi;
        
    //     let remainingLoanBalance = newPrincipal;
    //     let cumulativePrincipalPaid = 0;
    //     let i = 1;
        
    //     revisedEmiChartDisplay.innerHTML = '';
        
    //     while (remainingLoanBalance > 0.000001) {
    //         let interestPaid = flatInterestPerMonth; 
    //         let principalPaid = emi - interestPaid;
            
    //         if (remainingLoanBalance < emi) {
    //             emi = (loanAmt - cumulativePrincipalPaid - amountToBePrepaid - (loanEmisPaid * (copiedEmi - flatInterestPerMonth)));
    //             interestPaid = 0;; 
    //             principalPaid = emi;
    //             remainingLoanBalance = 0;
    //         } else {
    //             remainingLoanBalance -= principalPaid;
    //         }
    
    //         cumulativePrincipalPaid += principalPaid;
    //         let percentageOfLoanPaid = (cumulativePrincipalPaid / newPrincipal) * 100;
            
    //         let row = `
    //             <tr>
    //                 <td>${i}</td>
    //                 <td>₹${emi.toFixed(2)}</td>
    //                 <td>₹${interestPaid.toFixed(2)}</td>
    //                 <td>₹${principalPaid.toFixed(2)}</td>
    //                 <td>₹${remainingLoanBalance.toFixed(2)}</td>
    //                 <td>₹${cumulativePrincipalPaid.toFixed(2)}</td>
    //                 <td>${percentageOfLoanPaid.toFixed(2)}%</td>
    //             </tr>
    //         `;
    //         revisedEmiChartDisplay.innerHTML += row;
    //         i++;
    //         originalEmisOutstanding.textContent = `EMIs outstanding today: ${tenure - loanEmisPaid}`;
    //         recalculatedEmiORTenure.textContent = `Reduced Tenure: ${i - 1} EMIs outstanding`;
    //     }
    // }    
}


const calculateEMI = function () {
    const loanAmt = parseFloat(document.getElementById("loan_amount").value);
    const int = parseFloat(document.getElementById("interest_rate").value);
    const tenure = parseInt(document.getElementById("tenure").value);
    let interest = int / 100 / 12;
      const emi = (loanAmt * interest * ((1 + interest) ** tenure)) / (((1 + interest) ** tenure) - 1);
    emiCalculated.textContent = `EMI: Rs.` + emi.toFixed(2);
    
    let remainingLoanBalance = loanAmt;
    let cumulativePrincipalPaid = 0;
    

    emiChartDisplay.innerHTML = '';

    for (let i = 1; i <= tenure; i++) {
        let interestPaid = remainingLoanBalance * interest;
        let principalPaid = emi - interestPaid;
        remainingLoanBalance -= principalPaid;
        cumulativePrincipalPaid += principalPaid;
        let percentageOfLoanPaid = (cumulativePrincipalPaid / loanAmt) * 100;

        let row = `
            <tr>
                <td>${i}</td>
                <td>₹${emi.toFixed(2)}</td>
                <td>₹${interestPaid.toFixed(2)}</td>
                <td>₹${principalPaid.toFixed(2)}</td>
                <td>₹${remainingLoanBalance.toFixed(2)}</td>
                <td>₹${cumulativePrincipalPaid.toFixed(2)}</td>
                <td>${percentageOfLoanPaid.toFixed(2)}%</td>
            </tr>
        `;
        emiChartDisplay.innerHTML += row; 
    }
}

const calculatePrepaymentBenefits = function() {
    const loanAmt = parseFloat(document.getElementById("loan_amount").value);
    const int = parseFloat(document.getElementById("interest_rate").value);
    const tenure = parseInt(document.getElementById("tenure").value);
    const loanEmisPaid = parseInt(document.getElementById("loan_emis_paid").value);
    const amountToBePrepaid = parseFloat(document.getElementById("prepayment_amount").value);
    const emiOption = document.getElementById("emi_reduction");
    const tenureOption = document.getElementById("tenure_reduction");
    const originalEmisOutstanding = document.getElementById("emis_originally_outstanding");
    let interest = int / 100 / 12;
    const currentEMI = function () {
      return (loanAmt * interest * ((1 + interest) ** tenure)) / (((1 + interest) ** tenure) - 1);
      
    }

    if (emiOption.checked) {
      const remainingPrincipal = (loanAmt * (((1+interest) ** tenure) - ((1 + interest) ** loanEmisPaid))) / (((1 + interest) ** tenure) - 1);
      const newPrincipal = remainingPrincipal - amountToBePrepaid;
      const remainingTenure = tenure - loanEmisPaid;
      const reducedEmi = (newPrincipal * interest * ((1 + interest) ** remainingTenure)) / (((1 + interest) ** remainingTenure) - 1);
      recalculatedEmiORTenure.textContent = `Reduced EMI: Rs. ${reducedEmi.toFixed(2)}`;

      let remainingLoanBalance = newPrincipal;
      let cumulativePrincipalPaid = 0;
    
      revisedEmiChartDisplay.innerHTML = '';

      for (let i = 1; i <= remainingTenure; i++) {
        let interestPaid = remainingLoanBalance * interest;
        let principalPaid = reducedEmi - interestPaid;
        remainingLoanBalance -= principalPaid;
        cumulativePrincipalPaid += principalPaid;
        let percentageOfLoanPaid = (cumulativePrincipalPaid / newPrincipal) * 100;

        let row = `
            <tr>
                <td>${i}</td>
                <td>₹${reducedEmi.toFixed(2)}</td>
                <td>₹${interestPaid.toFixed(2)}</td>
                <td>₹${principalPaid.toFixed(2)}</td>
                <td>₹${remainingLoanBalance.toFixed(2)}</td>
                <td>₹${cumulativePrincipalPaid.toFixed(2)}</td>
                <td>${percentageOfLoanPaid.toFixed(2)}%</td>
            </tr>
        `;
        revisedEmiChartDisplay.innerHTML += row; 
      }
    } else if (tenureOption.checked) {
        const remainingPrincipal = (loanAmt * (((1 + interest) ** tenure) - ((1 + interest) ** loanEmisPaid))) / (((1 + interest) ** tenure) - 1);
        const newPrincipal = remainingPrincipal - amountToBePrepaid;
        let emi = (loanAmt * interest * ((1 + interest) ** tenure)) / (((1 + interest) ** tenure) - 1);
    
        let remainingLoanBalance = newPrincipal;
        let cumulativePrincipalPaid = 0;
        let i = 1;
    
        revisedEmiChartDisplay.innerHTML = '';
    
        while (remainingLoanBalance > 0.000001) {
            let interestPaid = remainingLoanBalance * interest;
            let principalPaid = emi - interestPaid;
    
            if (remainingLoanBalance < emi) {
                principalPaid = remainingLoanBalance;
                remainingLoanBalance = 0;
                emi = principalPaid + interestPaid;
            } else {
                remainingLoanBalance -= principalPaid;
            }
            cumulativePrincipalPaid += principalPaid;
            let percentageOfLoanPaid = (cumulativePrincipalPaid / newPrincipal) * 100;
    
            let row = `
                <tr>
                    <td>${i}</td>
                    <td>₹${emi.toFixed(2)}</td>
                    <td>₹${interestPaid.toFixed(2)}</td>
                    <td>₹${principalPaid.toFixed(2)}</td>
                    <td>₹${remainingLoanBalance.toFixed(2)}</td>
                    <td>₹${cumulativePrincipalPaid.toFixed(2)}</td>
                    <td>${percentageOfLoanPaid.toFixed(2)}%</td>
                </tr>
            `;
            revisedEmiChartDisplay.innerHTML += row;
            i++;
        }
        originalEmisOutstanding.textContent = `EMIs outstanding today: ${tenure - loanEmisPaid}`;
        recalculatedEmiORTenure.textContent = `Reduced Tenure: ${i - 1} EMIs outstanding`;
    }
}
emiBtn.onclick = function() {
    if (flatCheckbox.checked !== true) {
        calculateEMI();
    } else {
        calculateEMIFlat();
    }
};

prepaymentBtn.onclick = function() {
    if (flatCheckbox.checked !== true) {
        calculatePrepaymentBenefits();
    } else {
        calculatePrepaymentBenefitsFlat();
    }
};

