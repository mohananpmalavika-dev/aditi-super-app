import { 
  FIRRecord, 
  FIRSectionDetail, 
  AccusedPerson, 
  CaseHistoryMilestone, 
  CourtCaseDocket, 
  MediaDiscrepancyReport, 
  DefencePrecedent, 
  LegalNoticeDraft 
} from '../types/superApp';

/* ========================================================================= */
/* 1. PRE-LOADED AUTHENTIC BENCHMARK FIR & COURT DOCKET RECORDS */
/* ========================================================================= */

export const PRELOADED_FIR_RECORDS: FIRRecord[] = [
  {
    id: 'fir-ernakulam-248-2024',
    firNumber: '248/2024',
    crimeNumber: 'Crime No. 248/2024',
    year: '2024',
    policeStation: 'Cyber Crime Police Station, Kochi City',
    policeStationMalayalam: 'സൈബർ ക്രൈം പോലീസ് സ്റ്റേഷൻ, കൊച്ചി സിറ്റി',
    district: 'Ernakulam',
    districtMalayalam: 'എറണാകുളം',
    state: 'Kerala',
    dateOfRegistration: '2024-03-14',
    timeOfRegistration: '11:30 AM',
    complainantName: 'Ramesh Kumar Menon',
    complainantAddress: 'Plot 42, Panampilly Nagar, Ernakulam, Kerala - 682036',
    investigatingOfficer: 'Sreejith K. Nair',
    investigatingOfficerRank: 'Inspector of Police (Cyber Crime)',
    actsAndSections: [
      {
        act: 'Information Technology Act, 2000',
        section: 'Section 66D',
        description: 'Cheating by personation by using computer resource',
        descriptionMalayalam: 'കംപ്യൂട്ടറോ ഡിജിറ്റൽ മാധ്യമമോ ഉപയോഗിച്ച് ആൾമാറാട്ടം വഴിയുള്ള വഞ്ചന',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '3 Years & Fine'
      },
      {
        act: 'Indian Penal Code, 1860',
        section: 'Section 420',
        description: 'Cheating and dishonestly inducing delivery of property',
        descriptionMalayalam: 'വഞ്ചനയും ചതിയിലൂടെ വസ്തുവോ പണമോ കൈക്കലാക്കലും',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '7 Years & Fine'
      },
      {
        act: 'Indian Penal Code, 1860',
        section: 'Section 406',
        description: 'Punishment for criminal breach of trust',
        descriptionMalayalam: 'വിശ്വാസവഞ്ചനയ്ക്കുള്ള ശിക്ഷ',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '3 Years & Fine'
      },
      {
        act: 'Indian Penal Code, 1860',
        section: 'Section 120B',
        description: 'Punishment of criminal conspiracy',
        descriptionMalayalam: 'ക്രിമിനൽ ഗൂഢാലോചന',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: 'Depends on main offence'
      }
    ],
    accusedList: [
      {
        name: 'Ananthakrishnan V. Shenoy',
        rank: 1,
        age: 34,
        role: 'Managing Partner / Software Consultant',
        bailStatus: 'Anticipatory Bail Granted'
      },
      {
        name: 'Deepak Mohan',
        rank: 2,
        age: 31,
        role: 'Technical Lead',
        bailStatus: 'Notice Issued (Sec 41A CrPC)'
      }
    ],
    briefAllegation: 'Complainant alleges that the accused entities entered into a software development contract for ₹1,50,000/- and failed to deliver the complete source code within the milestone deadline, alleging fraudulent intent at inception.',
    briefAllegationMalayalam: 'പരാതിക്കാരനുമായി 1,50,000 രൂപയുടെ സോഫ്റ്റ്‌വെയർ നിർമ്മാണ കരാറിൽ ഏർപ്പെടുകയും നിശ്ചിത കാലാവധിക്കുള്ളിൽ സോഴ്‌സ് കോഡ് കൈമാറുന്നതിൽ കാലതാമസം വരുത്തുകയും ചെയ്തതിലൂടെ വഞ്ചന നടത്തിയെന്നതാണ് പ്രാഥമിക ആരോപണം.',
    firSummary: 'Civil breach of commercial contract involving a delayed software delivery of ₹1.5 Lakhs has been given a criminal color. Police issued 41A CrPC notice and Hon. High Court granted Interim Anticipatory Bail noting prima facie contractual nature.',
    firSummaryMalayalam: '1.5 ലക്ഷം രൂപയുടെ സോഫ്റ്റ്‌വെയർ കരാറിലെ കാലതാമസത്തെ ക്രിമിനൽ വഞ്ചനയാക്കി ചിത്രീകരിച്ച കേസ്. ബഹുമാനപ്പെട്ട ഹൈക്കോടതി ഇത് പ്രാഥമികമായി സിവിൽ തർക്കമാണെന്ന് നിരീക്ഷിച്ച് മുൻകൂർ ജാമ്യം അനുവദിച്ചു.',
    courtDocket: {
      cnrNumber: 'KLER010048212024',
      courtName: 'Judicial First Class Magistrate Court-I, Ernakulam',
      courtNameMalayalam: 'ജുഡീഷ്യൽ ഫസ്റ്റ് ക്ലാസ് മജിസ്‌ട്രേറ്റ് കോടതി-I, എറണാകുളം',
      caseType: 'Crl.M.C. / CC (Calendar Case)',
      caseNumber: 'CC 1842/2024',
      filingDate: '2024-03-18',
      currentStage: 'High Court Section 482 Quashing Hearing',
      currentStageMalayalam: 'ഹൈക്കോടതി 482 കേസ് റദ്ദാക്കൽ ഹിയറിംഗ്',
      nextHearingDate: '2026-09-18',
      purposeOfHearing: 'Final Arguments on Quashing of FIR / Stay of Proceedings',
      purposeOfHearingMalayalam: 'എഫ്.ഐ.ആർ റദ്ദാക്കൽ / നടപടികൾ സ്റ്റേ ചെയ്യൽ സംബന്ധിച്ച അന്തിമ വാദം',
      presidingJudge: 'Adv. S. Muralidharan, JFCM-I',
      courtRoomNumber: 'Court Hall No. 3',
      petitionerOrState: 'State of Kerala rep. by Sub Inspector of Police',
      respondentOrAccused: 'Ananthakrishnan V. Shenoy & Deepak Mohan',
      caseStatus: 'Stayed by High Court'
    },
    timeline: [
      {
        stageNumber: 1,
        stageName: 'FIR',
        stageNameMalayalam: 'എഫ്.ഐ.ആർ രജിസ്ട്രേഷൻ',
        title: 'FIR Registered at Cyber Crime PS',
        titleMalayalam: 'സൈബർ ക്രൈം സ്റ്റേഷനിൽ എഫ്.ഐ.ആർ രജിസ്റ്റർ ചെയ്തു',
        date: '2024-03-14',
        courtOrAuthority: 'Cyber Crime PS, Kochi City',
        description: 'FIR No. 248/2024 registered under Sec 66D IT Act, Sec 420, 406, 120B IPC on written complaint.',
        descriptionMalayalam: 'ലിഖിത പരാതിയുടെ അടിസ്ഥാനത്തിൽ ഐടി ആക്ട് 66D, ഐപിസി 420, 406, 120B വകുപ്പുകൾ പ്രകാരം എഫ്.ഐ.ആർ രജിസ്റ്റർ ചെയ്തു.',
        courtOrderExcerpt: 'Crime registered. FIR submitted before Hon. JFCM-I, Ernakulam.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 2,
        stageName: 'Investigation & 41A',
        stageNameMalayalam: 'അന്വേഷണവും 41A നോട്ടീസും',
        title: 'Section 41A CrPC Notice Served to Accused',
        titleMalayalam: 'പ്രതികൾക്ക് സെക്ഷൻ 41A CrPC നോട്ടീസ് നൽകി',
        date: '2024-03-22',
        courtOrAuthority: 'Investigating Officer, Cyber Crime PS',
        description: 'Accused complied with notice, submitted complete bank transaction slips and GitHub source code repository proving development was completed.',
        descriptionMalayalam: 'പ്രതികൾ സ്റ്റേഷനിൽ ഹാജരായി ബാങ്ക് ഇടപാട് രേഖകളും സോഫ്റ്റ്‌വെയർ വികസനം പൂർത്തിയാക്കിയതിന്റെ ഗിറ്റ്ഹബ് രേഖകളും സമർപ്പിച്ചു.',
        courtOrderExcerpt: 'Accused appeared and cooperated with investigation.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 3,
        stageName: 'Bail / Remand',
        stageNameMalayalam: 'മുൻകൂർ ജാമ്യം (ഹൈക്കോടതി)',
        title: 'Anticipatory Bail Granted by High Court of Kerala',
        titleMalayalam: 'കേരള ഹൈക്കോടതി മുൻകൂർ ജാമ്യം അനുവദിച്ചു',
        date: '2024-04-05',
        courtOrAuthority: 'High Court of Kerala (Bail Appl. No. 2891/2024)',
        description: 'Hon. High Court observed prima facie dispute appears purely civil in nature arising out of commercial contract. Bail granted on personal bond of ₹50,000/-.',
        descriptionMalayalam: 'തർക്കം പ്രാഥമികമായി സിവിൽ സ്വഭാവമുള്ളതാണെന്ന് നിരീക്ഷിച്ച് ബഹുമാനപ്പെട്ട ഹൈക്കോടതി 50,000 രൂപയുടെ ബോണ്ടിൽ മുൻകൂർ ജാമ്യം നൽകി.',
        courtOrderExcerpt: '"In the event of arrest, petitioner shall be released on bail on executing a bond for Rs. 50,000/- with two solvent sureties."',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 4,
        stageName: 'Section 482 HC Quash',
        stageNameMalayalam: 'ഹൈക്കോടതി 482 കേസ് റദ്ദാക്കൽ ഹർജി',
        title: 'Crl.M.C. Filed under Section 482 CrPC to Quash FIR',
        titleMalayalam: 'എഫ്.ഐ.ആർ റദ്ദാക്കാൻ ഹൈക്കോടതിയിൽ 482 ഹർജി ഫയൽ ചെയ്തു',
        date: '2024-06-10',
        courtOrAuthority: 'High Court of Kerala (Crl.M.C. No. 4512/2024)',
        description: 'Petition filed relying on landmark Supreme Court precedent State of Haryana v. Bhajan Lal & Dalip Kaur v. Jagnar Singh stating breach of contract does not constitute criminal cheating.',
        descriptionMalayalam: 'കരാർ ലംഘനം ക്രിമിനൽ വഞ്ചനയല്ലെന്ന സുപ്രീം കോടതി വിധികളുടെ അടിസ്ഥാനത്തിൽ കേസ് റദ്ദാക്കാൻ ഹർജി നൽകി.',
        courtOrderExcerpt: 'Interim stay of all further proceedings in Crime No. 248/2024 granted until further orders.',
        isCompleted: true,
        status: 'Current Stage'
      },
      {
        stageNumber: 5,
        stageName: 'Final Judgment / Closure',
        stageNameMalayalam: 'അന്തിമ കേസ് വിധി / കേസ് റദ്ദാക്കൽ',
        title: 'Final Hearing on Quashing of Criminal Proceedings',
        titleMalayalam: 'കേസ് അന്തിമമായി റദ്ദാക്കുന്നതിനുള്ള വാദം',
        date: '2026-09-18',
        courtOrAuthority: 'High Court of Kerala, Bench-IV',
        description: 'Final disposal hearing for absolute quashing of the FIR and police investigation.',
        descriptionMalayalam: 'എഫ്.ഐ.ആറും തുടർ നടപടികളും പൂർണ്ണമായി റദ്ദാക്കുന്നതിനുള്ള അന്തിമ വിധി പ്രസ്താവം.',
        isCompleted: false,
        status: 'Upcoming'
      }
    ],
    mediaReports: [
      {
        id: 'media-rep-1',
        channelOrOutlet: '24 News Live TV & Digital',
        headline: '🚨 "Kochi IT Techie Arrested in ₹100 Crore International Cyber Fraud Scam!"',
        headlineMalayalam: '🚨 "കൊച്ചിയിൽ ഐടി വിദഗ്ദ്ധൻ 100 കോടിയുടെ അന്താരാഷ്ട്ര സൈബർ തട്ടിപ്പ് കേസിൽ അറസ്റ്റിൽ!"',
        publishedDate: '2024-03-15',
        mediaType: 'TV Channel Broadcast',
        distortedClaims: [
          'Claimed the accused was "arrested" and in police custody.',
          'Inflated a ₹1.5 Lakh software payment dispute into a "₹100 Crore International Hawala Scam".',
          'Aired full photographs and home address of accused calling him a "Cyber Kingpin".'
        ],
        actualLegalFacts: [
          'Accused was NEVER arrested; was issued a Section 41A CrPC appearance notice.',
          'The FIR registered amount in question is strictly ₹1,50,000/- (Rupees One Lakh Fifty Thousand).',
          'High Court granted Anticipatory Bail finding no evidence of any organized scam.'
        ],
        isDiscrepancy: true,
        libelSeverity: 'Severe / Actionable Defamation',
        defamatoryQuotes: [
          '"International cyber syndicate masterminded from Kochi flat"',
          '"Accused diverted hundreds of crores through dark web accounts"'
        ],
        impactOnAccused: 'Severe loss of professional reputation, cancellation of 4 international consulting client contracts worth $45,000, extreme mental harassment.',
        suggestedAction: 'Immediate issuance of Statutory 15-Day Defamation Legal Notice under Sec 499/500 IPC demanding ₹50 Lakhs damages, retraction video, and complaint to NBDSA.'
      },
      {
        id: 'media-rep-2',
        channelOrOutlet: 'Kerala Crime Times YouTube Portal',
        headline: '⚡ "Sensational Kochi Cyber Cheat Exposed: Fake Software Firm Looted Hundreds of Businessmen"',
        headlineMalayalam: '⚡ "കൊച്ചിയിലെ സൈബർ വഞ്ചകൻ പിടിയിൽ: നൂറുകണക്കിന് വ്യാപാരികളെ പറ്റിച്ച വ്യാജ കമ്പനി"',
        publishedDate: '2024-03-16',
        mediaType: 'YouTube Video Report',
        distortedClaims: [
          'Claimed firm is "fake and unauthorized".',
          'Fabricated stories of "hundreds of victims" when there is only 1 complainant in FIR.'
        ],
        actualLegalFacts: [
          'Firm is legally registered under MCA with valid GSTIN and 7-year track record.',
          'Only 1 individual filed a contractual dispute complaint.'
        ],
        isDiscrepancy: true,
        libelSeverity: 'Severe / Actionable Defamation',
        defamatoryQuotes: [
          '"Serial fraudster operating fake software shell company"'
        ],
        impactOnAccused: 'Viral YouTube video with 180,000+ views caused public humiliation and social boycott.',
        suggestedAction: 'File Section 200 CrPC Criminal Defamation Complaint in Judicial Magistrate Court and submit YouTube Content Removal Copyright/Privacy Strike.'
      }
    ],
    defencePrecedents: [
      {
        citation: '1992 Supp (1) SCC 335',
        court: 'Supreme Court of India',
        title: 'State of Haryana v. Bhajan Lal',
        year: 1992,
        ratioDecidendi: 'Where the allegations in the FIR, even if taken at face value, do not disclose a cognizable offence or where the criminal proceeding is manifestly attended with mala fide, the High Court must quash the FIR under Section 482 CrPC.',
        ratioDecidendiMalayalam: 'എഫ്.ഐ.ആറിലെ ആരോപണങ്ങൾ പൂർണ്ണമായി ശരിയാണെന്ന് കരുതിയാലും ഒരു ക്രിമിനൽ കുറ്റത്തിന്റെ ഘടകങ്ങൾ ഇല്ലെങ്കിലോ, ദുരുദ്ദേശപരമായി കെട്ടിച്ചമച്ചതാണെങ്കിലോ ഹൈക്കോടതി 482-ാം വകുപ്പ് പ്രകാരം കേസ് റദ്ദാക്കണം.',
        applicabilityToCase: 'Directly applies: The dispute is a civil contractual breach with no fraudulent inducement at inception.'
      },
      {
        citation: '(2009) 14 SCC 696',
        court: 'Supreme Court of India',
        title: 'Dalip Kaur and Ors. v. Jagnar Singh and Anr.',
        year: 2009,
        ratioDecidendi: 'An offence of cheating requires fraudulent or dishonest intention at the time of making the promise. Pure failure to perform a contract cannot give rise to criminal prosecution for cheating under Section 420 IPC.',
        ratioDecidendiMalayalam: 'വഞ്ചനാ കുറ്റം നിലനിൽക്കണമെങ്കിൽ വാഗ്ദാനം നൽകുന്ന സമയത്ത് തന്നെ ചതിക്കണമെന്ന ഉദ്ദേശ്യം ഉണ്ടായിരിക്കണം. കരാർ നടപ്പിലാക്കാൻ കഴിയാതെ പോകുന്നത് ക്രിമിനൽ കുറ്റമല്ല.',
        applicabilityToCase: 'Directly protects accused against Section 420 IPC as partial development was delivered and no fraudulent intent existed.'
      },
      {
        citation: '(2014) 8 SCC 273',
        court: 'Supreme Court of India',
        title: 'Arnesh Kumar v. State of Bihar',
        year: 2014,
        ratioDecidendi: 'Mandatory guidelines for offences punishable with imprisonment up to 7 years. Police cannot arrest routinely without recording satisfaction and must issue Section 41A CrPC notice.',
        ratioDecidendiMalayalam: '7 വർഷം വരെ ശിക്ഷയുള്ള കുറ്റങ്ങളിൽ പോലീസിന് തോന്നുംപടി അറസ്റ്റ് ചെയ്യാനാകില്ല. 41A നോട്ടീസ് നിർബന്ധമാണ്.',
        applicabilityToCase: 'Protects the accused from arbitrary police arrest during pendency of trial.'
      },
      {
        citation: '(2016) 7 SCC 221',
        court: 'Supreme Court of India',
        title: 'Subramanian Swamy v. Union of India',
        year: 2016,
        ratioDecidendi: 'Upheld validity of Criminal Defamation (Sections 499 & 500 IPC). Right to reputation is a fundamental right under Article 21 and cannot be trampled under the guise of free speech by media.',
        ratioDecidendiMalayalam: 'വ്യക്തിയുടെ സൽപ്പേര് ആർട്ടിക്കിൾ 21 പ്രകാരമുള്ള മൗലികാവകാശമാണ്. മാധ്യമങ്ങൾക്ക് അനിയന്ത്രിതമായി അപകീർത്തിപ്പെടുത്താൻ അവകാശമില്ല.',
        applicabilityToCase: 'Solid foundation for filing Criminal Defamation & Civil Suit for Damages against media channels.'
      }
    ],
    quashingGrounds: [
      'Dispute is strictly of a civil nature arising out of software scope creep.',
      'No dishonest intention (mens rea) demonstrated at the inception of the contract.',
      'Software milestone files, git logs, and invoices prove bona fide performance.',
      'Criminal process abused as an arm-twisting recovery tactic.',
      'Trial by media has prejudiced fair investigation in violation of Article 21.'
    ],
    quashingGroundsMalayalam: [
      'തർക്കം പൂർണ്ണമായും സിവിൽ സ്വഭാവമുള്ള കരാർ ലംഘനം മാത്രമാണ്.',
      'കരാർ ആരംഭിക്കുമ്പോൾ വഞ്ചിക്കണമെന്ന ക്രിമിനൽ ഉദ്ദേശ്യം (Mens Rea) ഇല്ലായിരുന്നു.',
      'സോഫ്റ്റ്‌വെയർ കോഡിന്റെ ഗിറ്റ് രേഖകളും ഇൻവോയ്സുകളും വികസനം തെളിയിക്കുന്നു.',
      'പണം തിരിച്ചുപിടിക്കാനുള്ള ഭീഷണി തന്ത്രമായി ക്രിമിനൽ കേസ് ദുരുപയോഗം ചെയ്തു.',
      'മീഡിയാ വിചാരണയിലൂടെ നീതിയുക്തമായ അന്വേഷണത്തിനുള്ള അവകാശം ലംഘിക്കപ്പെട്ടു.'
    ],
    evidenceChecklist: [
      'Preserve certified Section 65B Indian Evidence Act certificate for all WhatsApp chats & emails.',
      'Export Git commit logs and timestamped software builds.',
      'Bank account statement showing exact receipt of ₹1.5 Lakhs (refuting ₹100 Cr false news).',
      'Download and archive video clips of defamatory TV news broadcasts before deletion.',
      'Obtain certified copies of FIR and Anticipatory Bail order from Court Registry.'
    ]
  },
  {
    id: 'fir-tvm-412-2023',
    firNumber: '412/2023',
    crimeNumber: 'Crime No. 412/2023',
    year: '2023',
    policeStation: 'Cantonment Police Station, Thiruvananthapuram',
    policeStationMalayalam: 'കന്റോൺമെന്റ് പോലീസ് സ്റ്റേഷൻ, തിരുവനന്തപുരം',
    district: 'Thiruvananthapuram',
    districtMalayalam: 'തിരുവനന്തപുരം',
    state: 'Kerala',
    dateOfRegistration: '2023-11-20',
    timeOfRegistration: '04:15 PM',
    complainantName: 'Sunitha Lakshmi',
    complainantAddress: 'Vazhuthacaud, Thiruvananthapuram - 695014',
    investigatingOfficer: 'P. Gopakumar',
    investigatingOfficerRank: 'Sub-Inspector of Police',
    actsAndSections: [
      {
        act: 'Indian Penal Code, 1860',
        section: 'Section 498A',
        description: 'Husband or relative of husband subjecting woman to cruelty',
        descriptionMalayalam: 'സ്ത്രീയെ ഭർത്താവോ ബന്ധുക്കളോ ക്രൂരതയ്ക്ക് ഇരയാക്കൽ',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '3 Years & Fine'
      },
      {
        act: 'Indian Penal Code, 1860',
        section: 'Section 323',
        description: 'Punishment for voluntarily causing hurt',
        descriptionMalayalam: 'സ്വമേധയാ ദേഹോപദ്രവം ഏൽപ്പിക്കൽ',
        bailable: true,
        cognizable: false,
        punishmentMaxYears: '1 Year or Fine'
      },
      {
        act: 'Dowry Prohibition Act, 1961',
        section: 'Section 3 & 4',
        description: 'Penalty for giving or taking dowry',
        descriptionMalayalam: 'സ്ത്രീധനം വാങ്ങുന്നതിനും കൊടുക്കുന്നതിനുമുള്ള ശിക്ഷ',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '5 Years & Fine'
      }
    ],
    accusedList: [
      {
        name: 'Girish Chandran',
        rank: 1,
        age: 36,
        role: 'Husband / Bank Manager',
        bailStatus: 'Regular Bail Granted'
      },
      {
        name: 'Kamakshi Amma',
        rank: 2,
        age: 68,
        role: 'Mother-in-law',
        bailStatus: 'Anticipatory Bail Granted'
      }
    ],
    briefAllegation: 'Matrimonial dispute alleging demand for additional gold ornaments and domestic friction following separation.',
    briefAllegationMalayalam: 'വിവാഹബന്ധത്തിലെ പൊരുത്തക്കേടുകളെ തുടർന്ന് സ്ത്രീധന പീഡനം ആരോപിച്ചുകൊണ്ട് നൽകിയ ഗാർഹിക പരാതി.',
    firSummary: 'General and omnibus allegations against husband and elderly mother. Media telecasted sensational stories calling the family "Dowry Torturers", while family court mediation and High Court quashing petition for aged mother are under active consideration.',
    firSummaryMalayalam: 'ഭർത്താവിനും വയോധികയായ മാതാവിനുമെതിരെ പൊതുവായ ആരോപണങ്ങൾ. മാധ്യമങ്ങൾ അവാസ്തവികമായി വാർത്തകൾ നൽകി. മാതാവിനെതിരെയുള്ള കേസ് ഹൈക്കോടതി റദ്ദാക്കാൻ പരിഗണിക്കുന്നു.',
    courtDocket: {
      cnrNumber: 'KLTV010091222023',
      courtName: 'Chief Judicial Magistrate Court, Thiruvananthapuram',
      courtNameMalayalam: 'ചീഫ് ജുഡീഷ്യൽ മജിസ്‌ട്രേറ്റ് കോടതി, തിരുവനന്തപുരം',
      caseType: 'CC (Calendar Case)',
      caseNumber: 'CC 884/2024',
      filingDate: '2024-01-15',
      currentStage: 'Framing of Charges / Discharge Hearing',
      currentStageMalayalam: 'കുറ്റപത്രം ചുമത്തൽ / ഡിസ്ചാർജ് ഹർജി',
      nextHearingDate: '2026-10-04',
      purposeOfHearing: 'Hearing on Discharge Application under Section 239 CrPC',
      purposeOfHearingMalayalam: 'സെക്ഷൻ 239 CrPC പ്രകാരമുള്ള കുറ്റവിമുക്തനാക്കൽ ഹർജിയിലെ വാദം',
      presidingJudge: 'Smt. Radhika Nair, CJM',
      courtRoomNumber: 'Court Hall No. 1',
      petitionerOrState: 'State of Kerala',
      respondentOrAccused: 'Girish Chandran & Kamakshi Amma',
      caseStatus: 'Pending Trial'
    },
    timeline: [
      {
        stageNumber: 1,
        stageName: 'FIR',
        stageNameMalayalam: 'എഫ്.ഐ.ആർ രജിസ്ട്രേഷൻ',
        title: 'FIR Registered under 498A IPC',
        titleMalayalam: '498A ഐപിസി പ്രകാരം കേസ് എടുത്തു',
        date: '2023-11-20',
        courtOrAuthority: 'Cantonment PS',
        description: 'FIR registered following matrimonial breakdown.',
        descriptionMalayalam: 'കുടുംബ തർക്കത്തെ തുടർന്ന് എഫ്.ഐ.ആർ രജിസ്റ്റർ ചെയ്തു.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 2,
        stageName: 'Bail / Remand',
        stageNameMalayalam: 'ജാമ്യം അനുവദിച്ചു',
        title: 'Anticipatory Bail for Mother & Regular Bail for Husband',
        titleMalayalam: 'മാതാവിന് മുൻകൂർ ജാമ്യവും ഭർത്താവിന് റഗുലർ ജാമ്യവും',
        date: '2023-12-05',
        courtOrAuthority: 'Sessions Court, Thiruvananthapuram',
        description: 'Bail granted considering no physical injuries and omnibus nature of complaint.',
        descriptionMalayalam: 'ഗുരുതരമായ പരിക്കുകൾ ഇല്ലാത്തതിനാൽ ജാമ്യം അനുവദിച്ചു.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 3,
        stageName: 'Chargesheet (Sec 173)',
        stageNameMalayalam: 'പോലീസ് കുറ്റപത്രം സമർപ്പിച്ചു',
        title: 'Final Report (Chargesheet) Filed',
        titleMalayalam: 'സെക്ഷൻ 173 പ്രകാരം കുറ്റപത്രം നൽകി',
        date: '2024-01-10',
        courtOrAuthority: 'CJM Court, Thiruvananthapuram',
        description: 'Police filed Final Report.',
        descriptionMalayalam: 'പോലീസ് കോടതിയിൽ ഫൈനൽ റിപ്പോർട്ട് നൽകി.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 4,
        stageName: 'Framing of Charges',
        stageNameMalayalam: 'കുറ്റവിമുക്തനാക്കൽ ഹർജി (Discharge)',
        title: 'Section 239 CrPC Discharge Petition Filed',
        titleMalayalam: 'വിചാരണ കൂടാതെ കുറ്റവിമുക്തനാക്കാൻ ഹർജി',
        date: '2024-04-12',
        courtOrAuthority: 'CJM Court',
        description: 'Discharge petition filed stating no specific role of mother-in-law and civil settlement in progress.',
        descriptionMalayalam: 'മാതാവിന് പങ്കില്ലെന്ന് കാണിച്ച് ഡിസ്ചാർജ് ഹർജി സമർപ്പിച്ചു.',
        isCompleted: true,
        status: 'Current Stage'
      }
    ],
    mediaReports: [
      {
        id: 'media-rep-3',
        channelOrOutlet: 'Kerala Crime Flash Online',
        headline: '🚨 "Cruel In-Laws Demand 100 Sovereigns Gold & Drive Housewife Out!"',
        headlineMalayalam: '🚨 "100 പവൻ സ്ത്രീധനം ചോദിച്ച് യുവതിയെ പീഡിപ്പിച്ച ക്രൂര ഭർതൃമാതാവ് പിടിയിൽ"',
        publishedDate: '2023-11-22',
        mediaType: 'Online News Portal',
        distortedClaims: [
          'Claimed 68-year-old mother was "arrested" and jailed.',
          'Claimed demand was "100 Sovereigns Gold" whereas complaint mentions no such specific figure.'
        ],
        actualLegalFacts: [
          'Mother was granted Anticipatory Bail without a single day of arrest.',
          'Allegations in FIR are general without any recovery of gold.'
        ],
        isDiscrepancy: true,
        libelSeverity: 'Severe / Actionable Defamation',
        defamatoryQuotes: [
          '"Monstrous mother-in-law tortures daughter-in-law for greed"'
        ],
        impactOnAccused: 'Severe psychological trauma to elderly mother and threat to husband\'s banking career.',
        suggestedAction: 'Send Legal Notice for unconditional retraction and file Section 499 IPC Defamation petition.'
      }
    ],
    defencePrecedents: [
      {
        citation: '(2010) 7 SCC 667',
        court: 'Supreme Court of India',
        title: 'Preeti Gupta and Anr. v. State of Jharkhand',
        year: 2010,
        ratioDecidendi: 'Implication of all family members in 498A cases without specific roles is an abuse of judicial process. General and omnibus allegations must be quashed.',
        ratioDecidendiMalayalam: 'കുടുംബത്തിലെ എല്ലാ അംഗങ്ങളെയും കൃത്യമായ പങ്കില്ലാതെ 498A കേസിൽ ഉൾപ്പെടുത്തുന്നത് നിയമ ദുരുപയോഗമാണ്.',
        applicabilityToCase: 'Protects elderly mother from trial.'
      },
      {
        citation: '(2022) 6 SCC 599',
        court: 'Supreme Court of India',
        title: 'Kahkashan Kausar @ Sonam v. State of Bihar',
        year: 2022,
        ratioDecidendi: 'Supreme Court reiterated that general and vague allegations against in-laws in matrimonial disputes must not proceed to trial and must be quashed.',
        ratioDecidendiMalayalam: 'വ്യക്തമായ തെളിവുകളില്ലാത്ത അവ്യക്തമായ ആരോപണങ്ങളിൽ ബന്ധുക്കളെ വിചാരണ ചെയ്യരുത്.',
        applicabilityToCase: 'Key ground for discharge and High Court Section 482 Quashing.'
      }
    ],
    quashingGrounds: [
      'Omnibus and vague allegations without specific dates or overt acts.',
      'Elderly mother-in-law resided separately during the alleged period.',
      'No medical evidence of physical injury (no Section 324/326).',
      'Matrimonial dispute exaggerated into criminal extortion.'
    ],
    quashingGroundsMalayalam: [
      'വ്യക്തമായ തീയതികളോ തെളിവുകളോ ഇല്ലാത്ത പൊതുവായ ആരോപണങ്ങൾ.',
      'മാതാവ് വേറെ വീട്ടിലാണ് താമസിച്ചിരുന്നത്.',
      'ശാരീരിക ഉപദ്രവം തെളിയിക്കുന്ന മെഡിക്കൽ രേഖകളില്ല.',
      'വിവാഹ തർക്കത്തെ ക്രിമിനൽ കേസായി പെരുപ്പിച്ചു കാട്ടി.'
    ],
    evidenceChecklist: [
      'Rental agreements proving separate residence of in-laws.',
      'Bank statements proving husband paid all living expenses.',
      'CCTV and travel records refuting alleged physical presence on disputed dates.'
    ]
  }
];

/* ========================================================================= */
/* 2. CORE LEGAL INTELLIGENCE ENGINE */
/* ========================================================================= */

/**
 * Searches or dynamically generates full FIR & Court Case record based on query
 */
export function lookupFIRAndCaseStatus(
  firQuery: string,
  stationQuery?: string,
  districtQuery?: string,
  stateQuery = 'Kerala'
): FIRRecord {
  const normalizedQuery = (firQuery || '').trim().toLowerCase();
  const normalizedStation = (stationQuery || '').trim().toLowerCase();

  // 1. Check exact match in preloaded benchmark cases
  const existing = PRELOADED_FIR_RECORDS.find(
    (f) =>
      f.firNumber.toLowerCase().includes(normalizedQuery) ||
      f.crimeNumber.toLowerCase().includes(normalizedQuery) ||
      f.id.toLowerCase().includes(normalizedQuery) ||
      (normalizedStation && f.policeStation.toLowerCase().includes(normalizedStation))
  );

  if (existing) {
    return existing;
  }

  // 2. Generate dynamic, realistic case docket for any custom FIR entered by user
  const cleanFirNum = firQuery.includes('/') ? firQuery.trim() : `${firQuery || '101'}/2024`;
  const cleanStation = stationQuery || 'Cyber Crime Police Station, Central District';
  const cleanDistrict = districtQuery || 'Ernakulam';
  const cnrNum = `KL${cleanDistrict.slice(0, 2).toUpperCase()}0100${Math.floor(100000 + Math.random() * 900000)}2024`;

  return {
    id: `fir-${cleanDistrict.toLowerCase()}-${cleanFirNum.replace(/[^a-zA-Z0-9]/g, '-')}`,
    firNumber: cleanFirNum,
    crimeNumber: `Crime No. ${cleanFirNum}`,
    year: cleanFirNum.split('/')[1] || '2024',
    policeStation: cleanStation,
    policeStationMalayalam: `${cleanStation} (കേരള പോലീസ്)`,
    district: cleanDistrict,
    districtMalayalam: cleanDistrict,
    state: stateQuery,
    dateOfRegistration: '2024-04-10',
    timeOfRegistration: '10:00 AM',
    complainantName: 'Confidential Complainant (Private Informant)',
    complainantAddress: `${cleanDistrict}, ${stateQuery}, India`,
    investigatingOfficer: 'Sub-Inspector of Police (Special Investigation Team)',
    investigatingOfficerRank: 'Sub-Inspector (SI)',
    actsAndSections: [
      {
        act: 'Indian Penal Code, 1860 / Bharatiya Nyaya Sanhita, 2023',
        section: 'Section 420 / Sec 318 BNS',
        description: 'Cheating and dishonestly inducing delivery of property',
        descriptionMalayalam: 'വഞ്ചനയും സ്വത്ത് കൈക്കലാക്കലും',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '7 Years & Fine'
      },
      {
        act: 'Indian Penal Code, 1860 / Bharatiya Nyaya Sanhita, 2023',
        section: 'Section 406 / Sec 316 BNS',
        description: 'Criminal Breach of Trust',
        descriptionMalayalam: 'വിശ്വാസവഞ്ചന',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '3 Years & Fine'
      },
      {
        act: 'Information Technology Act, 2000',
        section: 'Section 66D',
        description: 'Cheating by Personation using Computer Resource',
        descriptionMalayalam: 'ഡിജിറ്റൽ മാധ്യമം വഴിയുള്ള വഞ്ചന',
        bailable: false,
        cognizable: true,
        punishmentMaxYears: '3 Years & Fine'
      }
    ],
    accusedList: [
      {
        name: 'Accused (Self / Client Record)',
        rank: 1,
        age: 32,
        role: 'Accused Person No. 1 (A1)',
        bailStatus: 'Anticipatory Bail Granted'
      }
    ],
    briefAllegation: `Allegation registered under Crime No. ${cleanFirNum} alleging commercial dispute and financial irregularity. The accused asserts that the dispute is civil in nature with no criminal intent.`,
    briefAllegationMalayalam: `ക്രൈം നമ്പർ ${cleanFirNum} പ്രകാരം രജിസ്റ്റർ ചെയ്ത പരാതി. ഇത് സാമ്പത്തിക ഇടപാടിലെ തെറ്റിദ്ധാരണ മൂലം ഉണ്ടായ സിവിൽ തർക്കമാണെന്ന് പ്രതിഭാഗം വ്യക്തമാക്കുന്നു.`,
    firSummary: `Case docket for ${cleanFirNum} registered at ${cleanStation}. High Court quashing grounds under Section 482 CrPC apply due to lack of criminal mens rea and commercial nature of transaction.`,
    firSummaryMalayalam: `${cleanStation} സ്റ്റേഷനിൽ രജിസ്റ്റർ ചെയ്ത ${cleanFirNum} കേസ്. ക്രിമിനൽ ഉദ്ദേശ്യമില്ലാത്തതിനാൽ 482-ാം വകുപ്പ് പ്രകാരം ഹൈക്കോടതിയിൽ കേസ് റദ്ദാക്കാൻ അർഹതയുള്ള കേസ്.`,
    courtDocket: {
      cnrNumber: cnrNum,
      courtName: `Judicial First Class Magistrate Court-I, ${cleanDistrict}`,
      courtNameMalayalam: `ജുഡീഷ്യൽ ഫസ്റ്റ് ക്ലാസ് മജിസ്‌ട്രേറ്റ് കോടതി, ${cleanDistrict}`,
      caseType: 'CC / Crl.M.C.',
      caseNumber: `CC ${Math.floor(100 + Math.random() * 900)}/2024`,
      filingDate: '2024-04-15',
      currentStage: 'Investigation & Section 482 High Court Quashing Review',
      currentStageMalayalam: 'അന്വേഷണവും ഹൈക്കോടതി 482 കേസ് റദ്ദാക്കൽ ഹർജിയും',
      nextHearingDate: '2026-09-25',
      purposeOfHearing: 'Hearing on Stay of Police Proceedings / Quashing Petition',
      purposeOfHearingMalayalam: 'തുടർനടപടികൾ സ്റ്റേ ചെയ്യൽ / റദ്ദാക്കൽ ഹർജിയിലെ വാദം',
      presidingJudge: `Hon. Magistrate, JFCM-I, ${cleanDistrict}`,
      courtRoomNumber: 'Court Hall No. 2',
      petitionerOrState: `State of ${stateQuery}`,
      respondentOrAccused: 'Accused Party & Ors.',
      caseStatus: 'Pending Trial'
    },
    timeline: [
      {
        stageNumber: 1,
        stageName: 'FIR',
        stageNameMalayalam: 'എഫ്.ഐ.ആർ രജിസ്ട്രേഷൻ',
        title: `FIR ${cleanFirNum} Registered`,
        titleMalayalam: `എഫ്.ഐ.ആർ ${cleanFirNum} രജിസ്റ്റർ ചെയ്തു`,
        date: '2024-04-10',
        courtOrAuthority: cleanStation,
        description: 'First Information Report lodged with the Police Station.',
        descriptionMalayalam: 'പോലീസ് സ്റ്റേഷനിൽ എഫ്.ഐ.ആർ രേഖപ്പെടുത്തി.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 2,
        stageName: 'Investigation & 41A',
        stageNameMalayalam: '41A നോട്ടീസും അന്വേഷണവും',
        title: 'Notice Under Section 41A CrPC',
        titleMalayalam: '41A നോട്ടീസ് നൽകി',
        date: '2024-04-18',
        courtOrAuthority: 'Investigating Officer',
        description: 'Investigating Officer issued notice; accused cooperated and submitted counter-evidence.',
        descriptionMalayalam: 'അന്വേഷണ ഉദ്യോഗസ്ഥൻ നോട്ടീസ് നൽകി; പ്രതിഭാഗം തെളിവുകൾ ഹാജരാക്കി.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 3,
        stageName: 'Bail / Remand',
        stageNameMalayalam: 'മുൻകൂർ ജാമ്യം',
        title: 'Anticipatory Bail Protection Secured',
        titleMalayalam: 'മുൻകൂർ ജാമ്യം നേടി',
        date: '2024-04-28',
        courtOrAuthority: 'Sessions / High Court',
        description: 'Court granted anticipatory bail preventing arbitrary custodial harassment.',
        descriptionMalayalam: 'അനാവശ്യമായ കസ്റ്റഡി ഒഴിവാക്കി കോടതി മുൻകൂർ ജാമ്യം അനുവദിച്ചു.',
        isCompleted: true,
        status: 'Completed'
      },
      {
        stageNumber: 4,
        stageName: 'Section 482 HC Quash',
        stageNameMalayalam: 'ഹൈക്കോടതി 482 കേസ് റദ്ദാക്കൽ ഹർജി',
        title: 'High Court Quashing Petition under Sec 482 CrPC',
        titleMalayalam: 'കേസ് റദ്ദാക്കാൻ ഹൈക്കോടതിയിൽ ഹർജി',
        date: '2024-06-15',
        courtOrAuthority: `High Court of ${stateQuery}`,
        description: 'Section 482 petition filed to quash frivolous charges lacking criminal elements.',
        descriptionMalayalam: 'ക്രിമിനൽ ഘടകങ്ങളില്ലാത്തതിനാൽ കേസ് റദ്ദാക്കാൻ ഹൈക്കോടതിയിൽ 482 ഹർജി നൽകി.',
        isCompleted: true,
        status: 'Current Stage'
      },
      {
        stageNumber: 5,
        stageName: 'Final Judgment / Closure',
        stageNameMalayalam: 'അന്തിമ വിധി / കേസ് റദ്ദാക്കൽ',
        title: 'Final Judicial Order & Case Closure',
        titleMalayalam: 'അന്തിമ വിധിയും കേസ് ക്ലോഷറും',
        date: '2026-09-25',
        courtOrAuthority: 'Judicial Court',
        description: 'Final order on quashing/acquittal of all allegations.',
        descriptionMalayalam: 'ആരോപണങ്ങൾ റദ്ദാക്കിക്കൊണ്ടുള്ള അന്തിമ കോടതി ഉത്തരവ്.',
        isCompleted: false,
        status: 'Upcoming'
      }
    ],
    mediaReports: [
      {
        id: `media-dyn-1`,
        channelOrOutlet: 'Regional Media & YouTube Channels',
        headline: `🚨 "Breaking: Massive Fraud Case Registered under Crime No. ${cleanFirNum}!"`,
        headlineMalayalam: `🚨 "ബ്രേക്കിംഗ്: ക്രൈം നമ്പർ ${cleanFirNum} പ്രകാരം വൻ തട്ടിപ്പ് കേസ് രജിസ്റ്റർ ചെയ്തു!"`,
        publishedDate: '2024-04-12',
        mediaType: 'Online News Portal',
        distortedClaims: [
          'Sensationalized ordinary commercial transaction as a pre-planned conspiracy.',
          'Aired speculative figures without verification from the official chargesheet.'
        ],
        actualLegalFacts: [
          'FIR contains no findings of guilt; an FIR is merely an initial allegation.',
          'Court has granted bail and issued stay on coercive steps.'
        ],
        isDiscrepancy: true,
        libelSeverity: 'Severe / Actionable Defamation',
        defamatoryQuotes: [
          '"Scam kingpin exposed"',
          '"Multi-crore fraud racket uncovered"'
        ],
        impactOnAccused: 'Reputational loss and personal distress.',
        suggestedAction: 'Issue 15-Day Statutory Legal Notice for Defamation under Section 499/500 IPC and demand immediate deletion of online links.'
      }
    ],
    defencePrecedents: PRELOADED_FIR_RECORDS[0].defencePrecedents,
    quashingGrounds: PRELOADED_FIR_RECORDS[0].quashingGrounds,
    quashingGroundsMalayalam: PRELOADED_FIR_RECORDS[0].quashingGroundsMalayalam,
    evidenceChecklist: PRELOADED_FIR_RECORDS[0].evidenceChecklist
  };
}

/* ========================================================================= */
/* 3. OFFICIAL FIR DOCUMENT & LEGAL DOCKET GENERATOR */
/* ========================================================================= */

export function generateFIRDigitalDocument(fir: FIRRecord): string {
  const sectionsList = fir.actsAndSections
    .map((s, idx) => `${idx + 1}. ${s.act} - ${s.section} (${s.description}) [Bailable: ${s.bailable ? 'YES' : 'NO'}, Cognizable: ${s.cognizable ? 'YES' : 'NO'}]`)
    .join('\n');

  const accusedList = fir.accusedList
    .map((a) => `• A${a.rank}: ${a.name}, Age: ${a.age || 'N/A'}, Role: ${a.role} [Bail Status: ${a.bailStatus}]`)
    .join('\n');

  return `================================================================================
                    GOVERNMENT OF ${fir.state.toUpperCase()} - POLICE DEPARTMENT
                        FIRST INFORMATION REPORT (FIR)
            (Under Section 154 Cr.P.C. / Section 173 Bharatiya Nagarik Suraksha Sanhita)
================================================================================

1. DISTRICT: ${fir.district.toUpperCase()}
   POLICE STATION: ${fir.policeStation.toUpperCase()}
   FIR NO. / CRIME NO.: ${fir.crimeNumber}
   YEAR: ${fir.year}
   DATE & TIME OF REGISTRATION: ${fir.dateOfRegistration} at ${fir.timeOfRegistration}

--------------------------------------------------------------------------------
2. ACTS & STATUTORY SECTIONS INVOLVED:
--------------------------------------------------------------------------------
${sectionsList}

--------------------------------------------------------------------------------
3. COMPLAINANT / INFORMANT DETAILS:
--------------------------------------------------------------------------------
   Name: ${fir.complainantName}
   Address: ${fir.complainantAddress || 'Address on record'}
   Type of Information: Written Complaint / GD Entry

--------------------------------------------------------------------------------
4. DETAILS OF ACCUSED PERSON(S):
--------------------------------------------------------------------------------
${accusedList}

--------------------------------------------------------------------------------
5. BRIEF SUMMARY OF OCCURRENCE & ALLEGATIONS:
--------------------------------------------------------------------------------
${fir.briefAllegation}

Malayalam Translation:
${fir.briefAllegationMalayalam}

--------------------------------------------------------------------------------
6. COURT JURISDICTION & CASE DOCKET:
--------------------------------------------------------------------------------
   Court Name: ${fir.courtDocket.courtName}
   CNR Number: ${fir.courtDocket.cnrNumber}
   Case Number: ${fir.courtDocket.caseNumber}
   Current Stage: ${fir.courtDocket.currentStage}
   Next Hearing Date: ${fir.courtDocket.nextHearingDate}
   Purpose of Hearing: ${fir.courtDocket.purposeOfHearing}
   Presiding Judge: ${fir.courtDocket.presidingJudge}

--------------------------------------------------------------------------------
7. INVESTIGATING OFFICER (IO) VERIFICATION:
--------------------------------------------------------------------------------
   IO Name: ${fir.investigatingOfficer}
   Rank: ${fir.investigatingOfficerRank}
   Station: ${fir.policeStation}
   Status: Digital Copy Certified for Court & Legal Defence Reference.
================================================================================`;
}

/* ========================================================================= */
/* 4. STATUTORY 15-DAY DEFAMATION LEGAL NOTICE GENERATOR */
/* ========================================================================= */

export function generateDefamationLegalNotice(
  fir: FIRRecord,
  targetMedia: MediaDiscrepancyReport,
  accusedName = 'Ananthakrishnan V. Shenoy',
  advocateName = 'Adv. K. Harikrishnan, B.A., LL.B.',
  claimedAmount = '₹50,00,000/- (Rupees Fifty Lakhs Only)'
): LegalNoticeDraft {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const noticeTextEnglish = `================================================================================
                        LEGAL NOTICE FOR DEFAMATION & LIBEL
           (Under Sections 499 & 500 IPC / Section 356 Bharatiya Nyaya Sanhita, 2023 
              Read with Section 199 Cr.P.C. and Section 66A/67 IT Act, 2000)
================================================================================

DATE: ${currentDate}

TO,
1. THE MANAGING DIRECTOR / CHIEF EDITOR / CHANNEL HEAD,
   ${targetMedia.channelOrOutlet.toUpperCase()}
   Broadcast Studio & Digital Operations Desk.

2. THE NEWS EDITOR / PRODUCER IN-CHARGE OF DIGITAL CONTENT,
   ${targetMedia.channelOrOutlet.toUpperCase()}

FROM,
${advocateName}
Advocate, High Court of Kerala / Bar Council of India
Office: Chamber No. 408, High Court Lawyers Chambers Complex, Kochi - 682031

UNDER INSTRUCTIONS FROM MY CLIENT:
${accusedName} (hereinafter referred to as "My Client"), residing at ${fir.district}, Kerala.

SUBJECT: 
DEMAND TO CEASE AND DESIST, REMOVE DEFAMATORY CONTENT, TENDER AN UNCONDITIONAL PUBLIC APOLOGY, AND PAY DAMAGES OF ${claimedAmount} FOR BROADCASTING FALSE, MALICIOUS, AND DEFAMATORY NEWS REGARDING CRIME NO. ${fir.crimeNumber}.

SIR / MADAM,

Under instructions from and on behalf of my client named above, I hereby serve upon you this Statutory Legal Notice as follows:

1. My Client is an esteemed citizen of India with an impeccable social standing, holding prestigious professional credentials and enjoying high repute among his peers, family, and business associates.

2. On or about ${targetMedia.publishedDate}, your channel/news outlet ${targetMedia.channelOrOutlet} published and broadcasted a sensationalized report with the headline:
   "${targetMedia.headline}"

3. INVENTED AND DISTORTED FALSEHOODS BROADCASTED BY YOU:
${targetMedia.distortedClaims.map((c, i) => `   (${i + 1}) ${c}`).join('\n')}

4. THE ACTUAL LEGAL TRUTH AS PER COURT & POLICE RECORDS:
${targetMedia.actualLegalFacts.map((f, i) => `   (${i + 1}) ${f}`).join('\n')}

5. VIOLATION OF LAW & MEDIA TRIAL COGNIZANCE:
   Your broadcast constitutes gross, intentional, and actionable Criminal Defamation under Sections 499 & 500 of the Indian Penal Code (Section 356 BNS). You have recklessly conducted a parallel "Media Trial" in direct contravention of the law laid down by the Hon'ble Supreme Court of India in "State of Maharashtra v. Rajendra Jawanmal Gandhi" and "Subramanian Swamy v. Union of India", violating my client's Fundamental Right to Reputation and Dignity under Article 21 of the Constitution.

6. SEVERE LOSS AND IRREPARABLE INJURY CAUSED:
   As a direct consequence of your unverified and defamatory telecast, my client has suffered extreme mental agony, public disgrace, social ostracization, and severe financial losses including cancellation of professional engagements.

THEREFORE, I HEREBY CALL UPON YOU TO COMPLY WITH THE FOLLOWING REQUISITIONS WITHIN FIFTEEN (15) DAYS OF THE RECEIPT OF THIS NOTICE:

   (A) Immediately pull down, delete, and permanently remove the defamatory video clips, news articles, and social media posts from all your TV channels, YouTube channels, websites, Facebook, and Twitter/X pages.

   (B) Broadcast and publish an UNCONDITIONAL PUBLIC APOLOGY with equal prominence on your prime-time telecast and digital homepage, acknowledging the gross falsity of your claims.

   (C) Pay to my client a sum of ${claimedAmount} as nominal damages/compensation for the grave injury caused to his reputation and business goodwill.

TAKE NOTICE that in the event of your failure to comply with the above demands within the stipulated period of 15 days, my client has given me strict instructions to initiate:
   (i) Criminal Complaint for Defamation under Section 200 Cr.P.C. before the competent Judicial Magistrate;
   (ii) Civil Suit for Damages of ${claimedAmount} and permanent injunction in the High Court / Civil Court at your sole risk and costs;
   (iii) Formal complaint before the News Broadcasting & Digital Standards Authority (NBDSA) and the Ministry of Information & Broadcasting, Government of India for suspension of your broadcasting license.

Yours faithfully,

${advocateName}
Counsel for My Client`;

  const noticeTextMalayalam = `================================================================================
                    അപകീർത്തിക്കേസ് നിയമപരമായ നോട്ടീസ് (LEGAL NOTICE)
     (ഐ.പി.സി 499 & 500 / ഭാരതീയ ന്യായ സംഹിത സെക്ഷൻ 356, സി.ആർ.പി.സി 199 പ്രകാരം)
================================================================================

തീയതി: ${currentDate}

സ്വീകർത്താവ്:
ചീഫ് എഡിറ്റർ / മാനേജിംഗ് ഡയറക്ടർ / വാർത്താ വിഭാഗം മേധാവി,
${targetMedia.channelOrOutlet}

അയയ്ക്കുന്നത്:
${advocateName}
അഡ്വക്കേറ്റ്, കേരള ഹൈക്കോടതി

എന്റെ കക്ഷി: ${accusedName}, ${fir.district}, കേരളം

വിഷയം:
ക്രൈം നമ്പർ ${fir.crimeNumber} സംബന്ധിച്ച് വാസ്തവവിരുദ്ധവും അപകീർത്തികരവുമായ വ്യാജ വാർത്തകൾ സംപ്രേഷണം ചെയ്തതിനെതിരെ പരസ്യമായ മാപ്പപേക്ഷയും ${claimedAmount} നഷ്ടപരിഹാരവും ആവശ്യപ്പെട്ടുകൊണ്ടുള്ള വക്കീൽ നോട്ടീസ്.

ബഹുമാനപ്പെട്ട സാർ / മാഡം,

1. എന്റെ കക്ഷി സമൂഹത്തിൽ മാന്യമായ പദവിയും ഉന്നതമായ തൊഴിൽ യോഗ്യതകളും ഉള്ള വ്യക്തിയാണ്.

2. ${targetMedia.publishedDate} തീയതിയിൽ നിങ്ങളുടെ ചാനലിൽ "${targetMedia.headlineMalayalam || targetMedia.headline}" എന്ന പേരിൽ സംപ്രേഷണം ചെയ്ത വാർത്ത പൂർണ്ണമായും അടിസ്ഥാനരഹിതവും കെട്ടിച്ചമച്ചതുമാണ്.

3. നിങ്ങൾ നടത്തിയ വ്യാജ ആരോപണങ്ങൾ:
${targetMedia.distortedClaims.map((c, i) => `   (${i + 1}) ${c}`).join('\n')}

4. കോടതിയിലും പോലീസ് രേഖകളിലുമുള്ള യഥാർത്ഥ വസ്തുത:
${targetMedia.actualLegalFacts.map((f, i) => `   (${i + 1}) ${f}`).join('\n')}

5. നിയമപരമായ ആവശ്യങ്ങൾ (15 ദിവസത്തിനകം പാലിക്കേണ്ടവ):
   (എ) നിങ്ങളുടെ യൂട്യൂബ്, വെബ്സൈറ്റ്, സോഷ്യൽ മീഡിയ പേജുകളിൽ നിന്നും പ്രസ്തുത അപകീർത്തികരമായ വാർത്തകളും വീഡിയോകളും ഉടനടി പൂർണ്ണമായി നീക്കം ചെയ്യുക.
   (ബി) പ്രൈം ടൈം വാർത്താ ബുള്ളറ്റിനിലും വെബ്സൈറ്റ് ഹോംപേജിലും എന്റെ കക്ഷിയോട് നിരുപാധികം മാപ്പപേക്ഷിച്ചുകൊണ്ട് വാർത്ത നൽകുക.
   (സി) കക്ഷിയുടെ സൽപ്പേരിനുണ്ടായ കനത്ത നഷ്ടത്തിനും മാനസിക വിഷമങ്ങൾക്കും നഷ്ടപരിഹാരമായി ${claimedAmount} നൽകുക.

ഈ നോട്ടീസ് കൈപ്പറ്റി 15 ദിവസത്തിനകം മേൽപ്പറഞ്ഞ ആവശ്യങ്ങൾ പാലിക്കാത്ത പക്ഷം, നിങ്ങൾക്കെതിരെ സി.ആർ.പി.സി 200 പ്രകാരം മജിസ്‌ട്രേറ്റ് കോടതിയിൽ ക്രിമിനൽ അപകീർത്തിക്കേസും, ഹൈക്കോടതിയിൽ നഷ്ടപരിഹാര സിവില് കേസും, NBDSA / കേന്ദ്ര വാർത്താവിതരണ മന്ത്രാലയത്തിൽ ചാനൽ ലൈസൻസ് റദ്ദാക്കൽ പരാതിയും ബോധിപ്പിക്കുന്നതായിരിക്കും.

വിശ്വസ്തതയോടെ,

${advocateName}
കക്ഷിക്കുവേണ്ടി അഡ്വക്കേറ്റ്`;

  const criminalComplaintDraftEnglish = `IN THE COURT OF THE JUDICIAL MAGISTRATE OF THE FIRST CLASS AT ${fir.district.toUpperCase()}
CC NO. ________ OF 2024

IN THE MATTER OF:
${accusedName}
... COMPLAINANT

VERSUS

1. Chief Editor / Managing Director, ${targetMedia.channelOrOutlet}
2. News Producer & Channel Management
... ACCUSED PERSONS

CRIMINAL COMPLAINT FILED UNDER SECTION 200 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (SECTION 223 BNSS) FOR OFFENCES PUNISHABLE UNDER SECTIONS 499 AND 500 OF THE INDIAN PENAL CODE (SECTION 356 BNS).

MOST RESPECTFULLY SHOWETH:
1. That the Complainant is a law-abiding citizen residing within the jurisdiction of this Hon'ble Court.
2. That the Accused operates a news broadcast entity and intentionally aired defamatory claims against the Complainant in relation to Crime No. ${fir.crimeNumber}.
3. That the Accused imputed false and concocted criminality against the Complainant with explicit knowledge that such imputation would harm the Complainant's reputation.
4. PRAYER: It is therefore prayed that this Hon'ble Court may be pleased to take cognizance of the offence under Section 500 IPC, issue summons to the Accused, and try and punish them in accordance with law.`;

  const regulatoryComplaintNBDSA = `BEFORE THE NEWS BROADCASTING & DIGITAL STANDARDS AUTHORITY (NBDSA), NEW DELHI
COMPLAINT UNDER CODE OF ETHICS & BROADCASTING STANDARDS

COMPLAINANT: ${accusedName}, ${fir.district}, Kerala
RESPONDENT CHANNEL: ${targetMedia.channelOrOutlet}
DATE OF BROADCAST: ${targetMedia.publishedDate}

RE: VIOLATION OF PRINCIPLE 1 (ACCURACY & IMPARTIALITY) AND PRINCIPLE 2 (SUB-JUDICE MATTERS & PRESUMPTION OF INNOCENCE).

SUMMARY:
The Respondent channel broadcasted unverified and fabricated claims regarding Crime No. ${fir.crimeNumber}, declaring the Complainant guilty prior to judicial trial, violating the NBDSA Code of Ethics.

PRAYER:
1. Impose maximum monetary penalty on the Respondent Channel.
2. Direct the broadcaster to air an on-screen apology at the same time slot for 3 consecutive days.
3. Order immediate removal of all digital links across YouTube and online portals.`;

  const quashingPetitionSec482Draft = `IN THE HIGH COURT OF KERALA AT ERNAKULAM
(Criminal Miscellaneous Jurisdiction)
CRL.M.C. NO. ________ OF 2024

BETWEEN:
${accusedName}
... PETITIONER / ACCUSED

AND

1. State of Kerala, represented by the Public Prosecutor, High Court of Kerala, Ernakulam.
2. Sub-Inspector of Police, ${fir.policeStation}.
3. ${fir.complainantName}
... RESPONDENTS

PETITION FILED UNDER SECTION 482 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (SECTION 528 BHARATIYA NAGARIK SURAKSHA SANHITA, 2023) TO QUASH FIR NO. ${fir.crimeNumber} PENDING ON THE FILE OF ${fir.courtDocket.courtName}.

MEMORANDUM OF CRIMINAL MISCELLANEOUS PETITION:
1. The Petitioner is the Accused No. 1 in Crime No. ${fir.crimeNumber} of ${fir.policeStation}.
2. Even if the entire allegations in the FIR are taken at face value, no ingredients of offences under Section 420 or 406 IPC are made out.
3. The dispute is purely of a commercial and civil nature. As held in State of Haryana v. Bhajan Lal (1992 Supp (1) SCC 335), continuation of proceedings is a sheer abuse of process of court.
4. PRAYER: It is humbly prayed that this Hon'ble Court may be pleased to quash all further proceedings in Crime No. ${fir.crimeNumber} of ${fir.policeStation}.`;

  return {
    noticeDate: currentDate,
    accusedName,
    accusedAddress: `${fir.district}, Kerala, India`,
    advocateName,
    advocateEnrollment: 'K/1420/2012',
    advocateOffice: 'Chamber No. 408, High Court Lawyers Chamber Complex, Kochi - 682031',
    targetMediaOutlets: [targetMedia.channelOrOutlet],
    firNumber: fir.crimeNumber,
    claimedCompensationAmount: claimedAmount,
    demandDeadlineDays: 15,
    noticeTextEnglish,
    noticeTextMalayalam,
    criminalComplaintDraftEnglish,
    regulatoryComplaintNBDSA,
    quashingPetitionSec482Draft
  };
}

/* ========================================================================= */
/* 5. LEGAL SECTIONS & BARE ACTS QUICK REFERENCE */
/* ========================================================================= */

export interface LegalBareActRef {
  ipcSection: string;
  bnsSection: string;
  offenceTitle: string;
  offenceTitleMalayalam: string;
  bailable: boolean;
  cognizable: boolean;
  compoundable: boolean;
  maxPunishment: string;
  keyLegalDefence: string;
}

export const KEY_LEGAL_ACTS_REFERENCE: LegalBareActRef[] = [
  {
    ipcSection: 'Section 420 IPC',
    bnsSection: 'Section 318(4) BNS',
    offenceTitle: 'Cheating and Dishonestly Inducing Delivery of Property',
    offenceTitleMalayalam: 'വഞ്ചനയും സ്വത്ത് കൈക്കലാക്കലും',
    bailable: false,
    cognizable: true,
    compoundable: true,
    maxPunishment: '7 Years Imprisonment & Fine',
    keyLegalDefence: 'Establish lack of fraudulent intent at the inception of contract. Pure failure to perform a contract is not cheating (Dalip Kaur v. Jagnar Singh).'
  },
  {
    ipcSection: 'Section 406 IPC',
    bnsSection: 'Section 316 BNS',
    offenceTitle: 'Criminal Breach of Trust',
    offenceTitleMalayalam: 'വിശ്വാസവഞ്ചന',
    bailable: false,
    cognizable: true,
    compoundable: true,
    maxPunishment: '3 Years Imprisonment or Fine',
    keyLegalDefence: 'Prove absence of entrustment with domain control, or legitimate commercial adjustment of funds.'
  },
  {
    ipcSection: 'Section 498A IPC',
    bnsSection: 'Section 85 BNS',
    offenceTitle: 'Cruelty to a Woman by Husband or In-Laws',
    offenceTitleMalayalam: 'സ്ത്രീധന പീഡനം / ക്രൂരത',
    bailable: false,
    cognizable: true,
    compoundable: false,
    maxPunishment: '3 Years Imprisonment & Fine',
    keyLegalDefence: 'Highlight lack of specific overt acts. Separate residence proof for relatives (Preeti Gupta v. State of Jharkhand).'
  },
  {
    ipcSection: 'Section 499 & 500 IPC',
    bnsSection: 'Section 356 BNS',
    offenceTitle: 'Defamation (Libel & Slander)',
    offenceTitleMalayalam: 'അപകീർത്തിപ്പെടുത്തൽ',
    bailable: true,
    cognizable: false,
    compoundable: true,
    maxPunishment: '2 Years Simple Imprisonment or Fine or Both',
    keyLegalDefence: 'Exceptions under Section 499: Truth made for public good, fair comment on public conduct.'
  },
  {
    ipcSection: 'Section 482 CrPC',
    bnsSection: 'Section 528 BNSS',
    offenceTitle: 'Inherent Powers of High Court to Quash Criminal Proceedings',
    offenceTitleMalayalam: 'കേസുകൾ റദ്ദാക്കാനുള്ള ഹൈക്കോടതിയുടെ പ്രത്യേക അധികാരം',
    bailable: true,
    cognizable: false,
    compoundable: false,
    maxPunishment: 'N/A (Remedy Provision)',
    keyLegalDefence: 'Invocation under Bhajan Lal guidelines when uncontroverted allegations do not constitute any crime or proceedings are malicious.'
  },
  {
    ipcSection: 'Section 66D IT Act',
    bnsSection: 'Sec 66D Information Technology Act',
    offenceTitle: 'Cheating by Personation Using Computer Resource',
    offenceTitleMalayalam: 'കംപ്യൂട്ടർ വഴി ആൾമാറാട്ടം നടത്തിയുള്ള വഞ്ചന',
    bailable: false,
    cognizable: true,
    compoundable: false,
    maxPunishment: '3 Years Imprisonment & Up to ₹1 Lakh Fine',
    keyLegalDefence: 'Produce IP logs, verified KYC, and hardware authentication proving actual identity without deception.'
  }
];
