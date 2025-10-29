export interface CMEResponse {
  activityID: string;
  catalog: string;
  startTime: string;
  instruments: Instrument[];
  sourceLocation: string;
  activeRegionNum: null;
  note: string;
  submissionTime: string;
  versionId: number;
  link: string;
  cmeAnalyses: CmeAnalysis[];
  linkedEvents: null;
  sentNotifications: SentNotification[];
}

export enum Catalog {
  M2MCatalog = "M2M_CATALOG",
}

export interface CmeAnalysis {
  isMostAccurate: boolean;
  time21_5: string;
  latitude: number;
  longitude: number | null;
  halfAngle: number;
  speed: number;
  type: Type;
  featureCode: FeatureCode;
  imageType: ImageType;
  measurementTechnique: MeasurementTechnique;
  note: string;
  levelOfData: number;
  tilt: null;
  minorHalfWidth: null;
  speedMeasuredAtHeight: number | null;
  submissionTime: string;
  link: string;
  enlilList: EnlilList[];
}

export interface EnlilList {
  modelCompletionTime: string;
  au: number;
  estimatedShockArrivalTime: null | string;
  estimatedDuration: number | null;
  rmin_re: number | null;
  kp_18: null;
  kp_90: number | null;
  kp_135: number | null;
  kp_180: number | null;
  isEarthGB: boolean;
  isEarthMinorImpact: boolean;
  link: string;
  impactList: ImpactList[] | null;
  cmeIDs: string[];
}

export interface ImpactList {
  isGlancingBlow: boolean;
  isMinorImpact: boolean;
  location: Location;
  arrivalTime: string;
}

export enum Location {
  BepiColombo = "BepiColombo",
  EuropaClipper = "Europa Clipper",
  Juice = "Juice",
  Juno = "Juno",
  Lucy = "Lucy",
  Mars = "Mars",
  OsirisApex = "OSIRIS-APEX",
  ParkerSolarProbe = "Parker Solar Probe",
  Psyche = "Psyche",
  SolarOrbiter = "Solar Orbiter",
  StereoA = "STEREO A",
}

export enum FeatureCode {
  LE = "LE",
  Sh = "SH",
}

export enum ImageType {
  Direct = "direct",
  RunningDifference = "running difference",
}

export enum MeasurementTechnique {
  PlaneOfSky = "Plane-of-sky",
  SwpcCat = "SWPC_CAT",
}

export enum Type {
  C = "C",
  O = "O",
  R = "R",
  S = "S",
}

export interface Instrument {
  displayName: DisplayName;
}

export enum DisplayName {
  GoesCcor1 = "GOES: CCOR-1",
  SOHOLascoC2 = "SOHO: LASCO/C2",
  SOHOLascoC3 = "SOHO: LASCO/C3",
  StereoASecchiCor2 = "STEREO A: SECCHI/COR2",
}

export interface LinkedEvent {
  activityID: string;
}

export interface SentNotification {
  messageID: string;
  messageIssueTime: string;
  messageURL: string;
}
