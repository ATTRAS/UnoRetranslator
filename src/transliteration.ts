function getAssociation(char: string) {
  const upCaseChar = char.toUpperCase();
  const isUpperCase = upCaseChar == char;
  switch (upCaseChar) {
    case 'А': return isUpperCase ? 'A' : 'a';
    case 'Б': return isUpperCase ? 'B' : 'b';
    case 'В': return isUpperCase ? 'V' : 'v';
    case 'Г': return isUpperCase ? 'G' : 'g';
    case 'Д': return isUpperCase ? 'D' : 'd';
    case 'Е': return isUpperCase ? 'E' : 'e';
    case 'Ё': return isUpperCase ? 'JO' : 'jo';
    case 'Ж': return isUpperCase ? 'ZH' : 'zh';
    case 'З': return isUpperCase ? 'Z' : 'z';
    case 'И': return isUpperCase ? 'I' : 'i';
    case 'Й': return isUpperCase ? 'J' : 'j';
    case 'К': return isUpperCase ? 'K' : 'k';
    case 'Л': return isUpperCase ? 'L' : 'l';
    case 'М': return isUpperCase ? 'M' : 'm';
    case 'Н': return isUpperCase ? 'N' : 'n';
    case 'О': return isUpperCase ? 'O' : 'o';
    case 'П': return isUpperCase ? 'P' : 'p';
    case 'Р': return isUpperCase ? 'R' : 'r';
    case 'С': return isUpperCase ? 'S' : 's';
    case 'Т': return isUpperCase ? 'T' : 't';
    case 'У': return isUpperCase ? 'U' : 'u';
    case 'Ф': return isUpperCase ? 'F' : 'f';
    case 'Х': return isUpperCase ? 'H' : 'h';
    case 'Ц': return isUpperCase ? 'C' : 'c';
    case 'Ч': return isUpperCase ? 'CH' : 'ch';
    case 'Ш': return isUpperCase ? 'SH' : 'sh';
    case 'Щ': return isUpperCase ? 'SHCH' : 'shch';;  
    case 'Ы': return isUpperCase ? 'Y' : 'y';
    case 'Э': return isUpperCase ? 'JE' : 'je';
    case 'Ю': return isUpperCase ? 'JU' : 'ju';
    case 'Я': return isUpperCase ? 'JA' : 'ja';
    case 'Ь': return '\'';
    case 'Ъ': return '#';
    default: return char;
  }
}

export function getTranslit(s: string) {
  return s.split('').map(getAssociation).join("");
}