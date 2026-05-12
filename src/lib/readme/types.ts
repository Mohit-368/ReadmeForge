export interface Screenshot {
  name: string;
  dataUrl: string;
}

export interface ReadmeFields {
  projName: string;
  tagline: string;
  ghUser: string;
  repoSlug: string;
  description: string;
  demoUrl: string;
  features: string;
  prereqs: string;
  installCmds: string;
  envVars: string;
  usageCmd: string;
  rawStructure: string;
  videoUrl: string;
  imageUrls: string;
  apiDocs: string;
  apiBase: string;
  contribNotes: string;
  authorName: string;
  authorGh: string;
  authorEmail: string;
  authorLinkedin: string;
  authorWebsite: string;
  customTech: string;
  supportMsg: string;
  supportBmac: string;
  supportKofi: string;
  supportPatreon: string;
  supportGhSponsors: string;
  license: string;
}

export const EMPTY_FIELDS: ReadmeFields = {
  projName: "", tagline: "", ghUser: "", repoSlug: "", description: "", demoUrl: "",
  features: "", prereqs: "", installCmds: "", envVars: "", usageCmd: "", rawStructure: "",
  videoUrl: "", imageUrls: "", apiDocs: "", apiBase: "", contribNotes: "",
  authorName: "", authorGh: "", authorEmail: "", authorLinkedin: "", authorWebsite: "",
  customTech: "", supportMsg: "", supportBmac: "", supportKofi: "", supportPatreon: "",
  supportGhSponsors: "", license: "MIT",
};

export interface ReadmeState {
  fields: ReadmeFields;
  techs: string[];
  badges: string[];
  sections: Record<string, boolean>;
  screenshots: Screenshot[];
}
