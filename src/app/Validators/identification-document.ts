import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, Validator } from "@angular/forms";

@Injectable({ providedIn: 'root' })
export class IdentificationDocument implements Validator {
    
    validate(control: AbstractControl): ValidationErrors | null {

        // Object for the last letter on nif/nie document
        let nifLetters:{ [key:string]: any} =  {
            0:"T", 1:"R", 2:"W", 3:"A", 4:"G", 5:"M", 6:"Y", 7:"F", 8:"P", 
            9:"D", 10:"X", 11:"B", 12:"N", 13:"J", 14:"Z", 15:"S", 16:"Q", 
            17:"V", 18:"H", 19:"L", 20:"C", 21:"K", 22:"E"
        }
        
        let document = control.value;

        // Regex for nif/nie
        let nif = /^[0-9]{8}[A-Z]{1}$/;
        let nie = /^[X,Y,Z]{1}[0-9]{7}[A-Z]{1}$/;

        // Guess document type to call appropiate validation function
        if (nif.test(document)) {
            // Split the parts of the nif
            const documentNumber:number = parseInt(document.substr(0,8));
            const documentLetter:string = document.substr(8,9);

            // Calculate the letter to check if valid
            let moduleLetter = documentNumber % 23;
            // Get the lleter after calculation
            let resCalculatedLetter = nifLetters[moduleLetter];

            // Check if provided letter matchs with calcultated letter
            if (documentLetter === resCalculatedLetter) {
                return null;
            } else {
                return { nifLetterValid: false };
            }
        } else if (nie.test(document)) {
            // Split the parts of nie
            const documentFirstLetter:string = document.substr(0,1);
            const documentNumber:string = document.substr(1,7);
            const documentLastLetter:string = document.substr(8,9);

            // NIE needs to convert first letter to number and add to the document
            // number before module calculation
            // Letter must be X, Y or Z otherwise is invalid
            let letter;

            if (documentFirstLetter === 'X') {
                letter = '0';
            } else if (documentFirstLetter === 'Y') {
                letter = '1';
            } else if (documentFirstLetter === 'Z') {
                letter = '2';
            } else {
                return { nieFirstLetterValid: false };
            }             
            // New number full number to calculate module
            let finalDocumentNumber = letter + documentNumber;

            // Calculate the letter to check if valid
            let moduleLetter = parseInt(finalDocumentNumber) % 23;
            // Get the lleter after calculation
            let resCalculatedLetter = nifLetters[moduleLetter];
            
            // Check if provided letter matchs with calcultated letter
            if (documentLastLetter === resCalculatedLetter) {
                return null;
            } else {
                return { nieLastLetterValid: false };
            }
        } else {
            return { generalFormatValid: false };
        }
    }
}

