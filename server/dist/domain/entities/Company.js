"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
class Company {
    constructor(name, email, contactNumber, headquarters, registrationDocument, password, industry, isEmailVerified, id, socialLinks, founded, about, website, logo, description, companySize, profileCompleted) {
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.headquarters = headquarters;
        this.registrationDocument = registrationDocument;
        this.password = password;
        this.industry = industry;
        this.isEmailVerified = isEmailVerified;
        this.id = id;
        this.socialLinks = socialLinks;
        this.founded = founded;
        this.about = about;
        this.website = website;
        this.logo = logo;
        this.description = description;
        this.companySize = companySize;
        this.profileCompleted = profileCompleted;
    }
}
exports.Company = Company;
