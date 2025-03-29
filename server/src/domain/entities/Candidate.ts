export class Candidate {
  constructor(
    public email: string,
    public name: string,
    public isVerified: Boolean,
    public profileCompleted: boolean,
    public isBlocked: boolean,
    public id?: string,
    public profession?: string | null,
    public bio?: string | null,
    public password?: string | null,
    public googleId?: string | null,
    public profileImage?: string | null,
    public projects?: Project[],
    public socialLinks?:
      | { linkedIn?: string | null; gitHub?: string | null }
      | null
      | undefined,
    public skills?: string[],
    public resume?: string | null,
    public experience?:
      | {
          jobTitle?: String | null;
          company?: String | null;
          location?: String | null;
          startDate?: Date | null;
          endDate?: Date | null;
          description?: String | null;
        }[]
      | []
  ) {}
}

export class Project {
  constructor(public tile: string) {}
}
