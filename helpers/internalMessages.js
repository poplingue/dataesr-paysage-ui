export const emailPattern =
    '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&:_])[A-Za-z\\d@$!%*#?&]{8,}';
export const emailPatternHint =
    '8 caractères minimum dont 1 chiffre, 1 caractère spécial, 1 majuscule';
export const genericErrorMsg = 'Une erreur est survenue';
export const passwordErrorMsg = 'Mot de passe incorrect';
export const emailErrorMsg = 'Email incorrect';
export const passwordMandatoryMsg = 'Le mot de passe est obligatoire';
export const emailMandatoryMsg = "L'email est obligatoire";
export const tokenMissingError = 'Tokens cookie missing';
export const disconnectedMsg = 'Vous êtes déconnecté';
export const connectedMsg = 'Vous êtes connecté';
export const codeMandatoryMsg = "Code d'activation obligatoire";
export const connectAdviceMsg = 'Connectez-vous pour recevoir un nouveau code';
export const connectToActivateMsg = 'Connectez-vous pour activer votre compte';

// External errors
export const combinationError = 'Mauvaise combinaison utilisateur/mot de passe';
export const tokenError = "Token d'access invalide ou expiré";
