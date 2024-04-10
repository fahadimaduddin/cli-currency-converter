#! /usr/bin/env node 
import inquirer from 'inquirer';
import chalk from 'chalk';
import axios from 'axios';
class CurrencyConverter {
    currencyRates;
    constructor() {
        this.currencyRates = {};
    }
    async fetchCurrencyRates(base) {
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
            this.currencyRates = response.data.rates;
        }
        catch (error) {
            console.error(chalk.red('Error fetching currency rates:', error.message));
        }
    }
    async convertCurrency(amount, from, to) {
        if (this.currencyRates[from] && this.currencyRates[to]) {
            const convertedAmount = (amount * this.currencyRates[to]) / this.currencyRates[from];
            return convertedAmount;
        }
        else {
            console.error(chalk.red('Invalid currency code.'));
            return -1;
        }
    }
    async start() {
        const { baseCurrency, targetCurrency, amount } = await inquirer.prompt([
            {
                type: 'input',
                name: 'baseCurrency',
                message: 'Enter the base currency code:'
            },
            {
                type: 'input',
                name: 'targetCurrency',
                message: 'Enter the target currency code:'
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Enter the amount to convert:'
            }
        ]);
        await this.fetchCurrencyRates(baseCurrency.toUpperCase());
        const convertedAmount = await this.convertCurrency(parseFloat(amount), baseCurrency.toUpperCase(), targetCurrency.toUpperCase());
        if (convertedAmount !== -1) {
            console.log(chalk.green.bold(`Converted amount: ${convertedAmount.toFixed(2)} ${targetCurrency.toUpperCase()}`));
        }
    }
}
// Main function to start the currency converter app
async function main() {
    console.log(chalk.yellow.bold('Welcome to Currency Converter!'));
    const converter = new CurrencyConverter();
    await converter.start();
}
main().catch(error => console.error(chalk.red('An error occurred:', error.message)));
