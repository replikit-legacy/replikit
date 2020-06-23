import { Repository } from "@replikit/storage";
import { Exclude } from "class-transformer";

export class EmbeddedEntity {
    @Exclude()
    protected repository: Repository;
}
