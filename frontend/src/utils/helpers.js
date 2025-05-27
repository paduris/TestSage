/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Truncate a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  
  return `${str.substring(0, length)}...`;
};

/**
 * Format a risk score to a readable format with color class
 * @param {number} score - Risk score (0-100)
 * @returns {object} Formatted score and color class
 */
export const formatRiskScore = (score) => {
  if (score === undefined || score === null) {
    return { text: 'N/A', colorClass: 'text-gray-500' };
  }
  
  const roundedScore = Math.round(score);
  
  if (roundedScore >= 75) {
    return { text: `${roundedScore}%`, colorClass: 'text-red-600' };
  } else if (roundedScore >= 50) {
    return { text: `${roundedScore}%`, colorClass: 'text-orange-500' };
  } else if (roundedScore >= 25) {
    return { text: `${roundedScore}%`, colorClass: 'text-yellow-500' };
  } else {
    return { text: `${roundedScore}%`, colorClass: 'text-green-500' };
  }
};

/**
 * Get color class for risk level
 * @param {string} riskLevel - Risk level (LOW, MEDIUM, HIGH, CRITICAL)
 * @returns {string} CSS color class
 */
export const getRiskLevelColor = (riskLevel) => {
  switch (riskLevel) {
    case 'LOW':
      return 'bg-green-100 text-green-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get color class for priority
 * @param {string} priority - Priority (LOW, MEDIUM, HIGH, CRITICAL)
 * @returns {string} CSS color class
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'LOW':
      return 'bg-blue-100 text-blue-800';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

/**
 * Get file extension from file path
 * @param {string} filePath - File path
 * @returns {string} File extension
 */
export const getFileExtension = (filePath) => {
  if (!filePath) return '';
  
  const parts = filePath.split('.');
  if (parts.length === 1) return '';
  
  return parts[parts.length - 1].toLowerCase();
};

/**
 * Get language name from file extension
 * @param {string} extension - File extension
 * @returns {string} Language name
 */
export const getLanguageFromExtension = (extension) => {
  const languageMap = {
    'java': 'Java',
    'py': 'Python',
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'jsx': 'React JSX',
    'tsx': 'React TSX',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'json': 'JSON',
    'md': 'Markdown',
    'sql': 'SQL',
    'xml': 'XML',
    'yaml': 'YAML',
    'yml': 'YAML',
    'sh': 'Shell',
    'bash': 'Bash',
    'c': 'C',
    'cpp': 'C++',
    'cs': 'C#',
    'go': 'Go',
    'rb': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'rs': 'Rust'
  };
  
  return languageMap[extension] || 'Plain Text';
};

/**
 * Format file path for display
 * @param {string} filePath - File path
 * @returns {string} Formatted file path
 */
export const formatFilePath = (filePath) => {
  if (!filePath) return '';
  
  // Split by directory separator and get last two parts if possible
  const parts = filePath.split('/');
  if (parts.length <= 2) return filePath;
  
  const lastTwoParts = parts.slice(-2).join('/');
  return `.../${lastTwoParts}`;
};
