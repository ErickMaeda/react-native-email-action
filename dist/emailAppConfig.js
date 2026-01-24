/**
 * Email App Configuration (TypeScript)
 */
export const EMAIL_APPS = {
    gmail: {
        displayName: 'Gmail',
        scheme: 'googlegmail:',
        linkFormat: (to, subject, body, cc, bcc) => `googlegmail:///co?subject=${subject}&body=${body}&to=${to}&cc=${cc.join(',')}&bcc=${bcc.join(',')}`,
    },
    outlook: {
        displayName: 'Outlook',
        scheme: 'ms-outlook:',
        linkFormat: (to, subject, body, cc, bcc) => `ms-outlook://compose?to=${to}&subject=${subject}&body=${body}&cc=${cc.join(',')}&bcc=${bcc.join(',')}`,
    },
    mail: {
        displayName: 'Mail',
        scheme: 'message:',
        linkFormat: (to, subject, body, cc, bcc) => `mailto:${to}?subject=${subject}&body=${body}&cc=${cc.join(',')}&bcc=${bcc.join(',')}`,
    },
    spark: {
        displayName: 'Spark',
        scheme: 'readdle-spark:',
        linkFormat: (to, subject, body) => `readdle-spark://compose?recipients=${to}&subject=${subject}&body=${body}`,
    },
    airmail: {
        displayName: 'Airmail',
        scheme: 'airmail:',
        linkFormat: (to, subject, body) => `airmail://compose?to=${to}&subject=${subject}&body=${body}`,
    },
    superhuman: {
        displayName: 'Superhuman',
        scheme: 'superhuman:',
        linkFormat: (to, subject, body) => `superhuman://compose?to=${to}&subject=${subject}&body=${body}`,
    },
    ymail: {
        displayName: 'Yahoo Mail',
        scheme: 'ymail:',
        linkFormat: (to, subject, body) => `ymail://mail/compose?to=${to}&subject=${subject}&body=${body}`,
    },
    fastmail: {
        displayName: 'Fastmail',
        scheme: 'fastmail:',
        linkFormat: (to, subject, body) => `fastmail://compose?to=${to}&subject=${subject}&body=${body}`,
    },
    protonmail: {
        displayName: 'ProtonMail',
        scheme: 'protonmail:',
        linkFormat: (to, subject, body) => `protonmail://compose?to=${to}&subject=${subject}&body=${body}`,
    },
};
// Default apps to check for (Mail, Outlook, Gmail)
export const DEFAULT_APP_IDS = ['mail', 'outlook', 'gmail'];
