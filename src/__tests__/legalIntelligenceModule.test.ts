import { describe, it, expect } from 'vitest';
import { 
  lookupFIRAndCaseStatus, 
  generateFIRDigitalDocument, 
  generateDefamationLegalNotice, 
  PRELOADED_FIR_RECORDS,
  KEY_LEGAL_ACTS_REFERENCE,
  KERALA_POLICE_DISTRICTS_DIRECTORY,
  getPoliceStationsByDistrict 
} from '../services/legalIntelligenceService';

describe('AI Legal Intelligence, Case Docket & Defamation Engine', () => {
  it('retrieves preloaded benchmark case records with complete legal forensic details', () => {
    const fir = lookupFIRAndCaseStatus('248/2024');

    expect(fir.firNumber).toBe('248/2024');
    expect(fir.crimeNumber).toBe('Crime No. 248/2024');
    expect(fir.policeStation).toContain('Cyber Crime');
    expect(fir.district).toBe('Ernakulam');
    expect(fir.actsAndSections.length).toBeGreaterThanOrEqual(3);
    expect(fir.accusedList.length).toBeGreaterThanOrEqual(1);

    // Acts verification
    const itActSec = fir.actsAndSections.find((s) => s.section.includes('66D'));
    expect(itActSec).toBeDefined();
    expect(itActSec?.cognizable).toBe(true);

    // Court Docket verification
    expect(fir.courtDocket.cnrNumber).toBe('KLER010048212024');
    expect(fir.courtDocket.caseStatus).toBe('Stayed by High Court');
    expect(fir.courtDocket.presidingJudge).toBeDefined();
  });

  it('generates a full chronological case history timeline from FIR to Case Closure', () => {
    const fir = lookupFIRAndCaseStatus('248/2024');

    expect(fir.timeline.length).toBeGreaterThanOrEqual(4);
    
    // Stage 1: FIR
    expect(fir.timeline[0].stageName).toBe('FIR');
    expect(fir.timeline[0].isCompleted).toBe(true);

    // Stage 2: 41A Notice / Investigation
    expect(fir.timeline[1].stageName).toBe('Investigation & 41A');
    expect(fir.timeline[1].isCompleted).toBe(true);

    // Stage 3: Bail
    expect(fir.timeline[2].stageName).toBe('Bail / Remand');
    expect(fir.timeline[2].isCompleted).toBe(true);

    // Stage 4: High Court Quashing Petition
    expect(fir.timeline[3].stageName).toBe('Section 482 HC Quash');
    expect(fir.timeline[3].status).toBe('Current Stage');
  });

  it('accurately identifies media discrepancies, fake claims, and actionable libel severity', () => {
    const fir = lookupFIRAndCaseStatus('248/2024');

    expect(fir.mediaReports.length).toBeGreaterThanOrEqual(1);
    const mediaItem = fir.mediaReports[0];

    expect(mediaItem.isDiscrepancy).toBe(true);
    expect(mediaItem.libelSeverity).toBe('Severe / Actionable Defamation');
    expect(mediaItem.distortedClaims.length).toBeGreaterThanOrEqual(2);
    expect(mediaItem.actualLegalFacts.length).toBeGreaterThanOrEqual(2);
    expect(mediaItem.defamatoryQuotes.length).toBeGreaterThanOrEqual(1);
  });

  it('generates comprehensive Statutory 15-Day Defamation Legal Notice in Malayalam & English', () => {
    const fir = lookupFIRAndCaseStatus('248/2024');
    const mediaItem = fir.mediaReports[0];

    const notice = generateDefamationLegalNotice(
      fir,
      mediaItem,
      'Ananthakrishnan V. Shenoy',
      'Adv. K. Harikrishnan, B.A., LL.B.',
      '₹50,00,000/-'
    );

    expect(notice.firNumber).toBe('Crime No. 248/2024');
    expect(notice.demandDeadlineDays).toBe(15);
    expect(notice.claimedCompensationAmount).toBe('₹50,00,000/-');

    // English notice
    expect(notice.noticeTextEnglish).toContain('LEGAL NOTICE FOR DEFAMATION & LIBEL');
    expect(notice.noticeTextEnglish).toContain('Sections 499 & 500 IPC');
    expect(notice.noticeTextEnglish).toContain('FIFTEEN (15) DAYS');
    expect(notice.noticeTextEnglish).toContain('₹50,00,000/-');

    // Malayalam notice
    expect(notice.noticeTextMalayalam).toContain('അപകീർത്തിക്കേസ് നിയമപരമായ നോട്ടീസ്');
    expect(notice.noticeTextMalayalam).toContain('15 ദിവസത്തിനകം');
    expect(notice.noticeTextMalayalam).toContain('₹50,00,000/-');

    // Criminal Complaint (Sec 200 CrPC)
    expect(notice.criminalComplaintDraftEnglish).toContain('IN THE COURT OF THE JUDICIAL MAGISTRATE OF THE FIRST CLASS');
    expect(notice.criminalComplaintDraftEnglish).toContain('SECTION 200 OF THE CODE OF CRIMINAL PROCEDURE');

    // Regulatory NBDSA Complaint
    expect(notice.regulatoryComplaintNBDSA).toContain('NEWS BROADCASTING & DIGITAL STANDARDS AUTHORITY');

    // Section 482 HC Quashing Petition
    expect(notice.quashingPetitionSec482Draft).toContain('IN THE HIGH COURT OF KERALA AT ERNAKULAM');
    expect(notice.quashingPetitionSec482Draft).toContain('SECTION 482 OF THE CODE OF CRIMINAL PROCEDURE');
  });

  it('formats official Police FIR document with statutory sections and police certification', () => {
    const fir = lookupFIRAndCaseStatus('248/2024');
    const doc = generateFIRDigitalDocument(fir);

    expect(doc).toContain('FIRST INFORMATION REPORT (FIR)');
    expect(doc).toContain('Crime No. 248/2024');
    expect(doc).toContain('Cyber Crime Police Station');
    expect(doc).toContain('Section 66D');
    expect(doc).toContain('Section 420');
    expect(doc).toContain('Ananthakrishnan V. Shenoy');
    expect(doc).toContain('Digital Copy Certified for Court & Legal Defence Reference');
  });

  it('dynamically generates realistic forensic docket for any custom user-provided FIR', () => {
    const customFir = lookupFIRAndCaseStatus('999/2024', 'Kollam East Police Station', 'Kollam');

    expect(customFir.firNumber).toBe('999/2024');
    expect(customFir.policeStation).toBe('Kollam East Police Station');
    expect(customFir.district).toBe('Kollam');
    expect(customFir.courtDocket.cnrNumber).toContain('KLKL0100');
    expect(customFir.timeline.length).toBeGreaterThanOrEqual(4);
    expect(customFir.mediaReports.length).toBeGreaterThanOrEqual(1);
    expect(customFir.quashingGrounds.length).toBeGreaterThanOrEqual(3);
  });

  it('provides reference bare acts comparing IPC vs BNS with key defence strategies', () => {
    expect(KEY_LEGAL_ACTS_REFERENCE.length).toBeGreaterThanOrEqual(5);

    const sec420 = KEY_LEGAL_ACTS_REFERENCE.find((a) => a.ipcSection.includes('420'));
    expect(sec420).toBeDefined();
    expect(sec420?.bnsSection).toContain('318(4)');
    expect(sec420?.keyLegalDefence).toContain('Dalip Kaur');

    const sec482 = KEY_LEGAL_ACTS_REFERENCE.find((a) => a.ipcSection.includes('482'));
    expect(sec482).toBeDefined();
    expect(sec482?.keyLegalDefence).toContain('Bhajan Lal');
  });

  it('provides official Kerala 14 Districts and Police Stations directory for auto-filling', () => {
    expect(KERALA_POLICE_DISTRICTS_DIRECTORY.length).toBeGreaterThanOrEqual(14);

    // Verify Ernakulam
    const ekm = KERALA_POLICE_DISTRICTS_DIRECTORY.find((d) => d.district === 'Ernakulam');
    expect(ekm).toBeDefined();
    expect(ekm?.cnrPrefix).toBe('KLER');
    expect(ekm?.policeStations.length).toBeGreaterThanOrEqual(10);

    // Verify cascading helper
    const tvmStations = getPoliceStationsByDistrict('Thiruvananthapuram');
    expect(tvmStations.length).toBeGreaterThanOrEqual(8);
    const cantonment = tvmStations.find((s) => s.stationCode === 'TVM-CAN');
    expect(cantonment).toBeDefined();
    expect(cantonment?.magistrateCourt).toContain('Chief Judicial Magistrate');

    // Dynamic case lookup with specific station auto-fills proper court
    const customCase = lookupFIRAndCaseStatus('555/2024', 'Cantonment Police Station', 'Thiruvananthapuram');
    expect(customCase.district).toBe('Thiruvananthapuram');
    expect(customCase.courtDocket.cnrNumber).toContain('KLTV0100');
    expect(customCase.courtDocket.courtName).toContain('Chief Judicial Magistrate Court');
  });
});
