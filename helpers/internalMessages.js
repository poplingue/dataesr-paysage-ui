export const emailPattern =
    '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&:_])[A-Za-z\\d@$!%*#?&]{8,}';
export const emailPatternHint =
    '8 caractères minimum dont 1 chiffre, 1 caractère spécial, 1 majuscule';

export const activationCodePattern = '^\\d{6}$';
export const lostPasswordMsg = "J'ai perdu mon mot de passe";
export const noData = 'Donnée vide';
export const inactiveUserError = 'Utilisateur inactif';
export const genericErrorMsg = 'Une erreur est survenue';
export const passwordErrorMsg = 'Mot de passe incorrect';
export const emailErrorMsg = 'Email incorrect';
export const codeSendByEmailMsg = 'Vous avez reçu un code par mail';
export const passwordMandatoryMsg = 'Le mot de passe est obligatoire';
export const emailMandatoryMsg = "L'email est obligatoire";
export const connectedMsg = 'Vous êtes connecté';
export const notConnectedMsg = 'Vous êtes hors ligne';
export const codeMandatoryMsg = "Code d'activation obligatoire";
export const activateAdviceMsg = 'Activez votre compte';
export const connectToAccessMsg = 'Connectez-vous pour accéder';
export const noTokensError = 'No Tokens';
export const connexionNeeded = 'Vous devez être connecté';

// External errors
export const combinationError = 'Mauvaise combinaison utilisateur/mot de passe';
export const invalidToken = "Token d'access invalide ou expiré";
