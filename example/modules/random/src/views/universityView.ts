import { OutMessageLike } from "@replikit/messages/typings";
import { MultiStateView, state, ViewMessageBuilder } from "@replikit/views";

export class UniversityView extends MultiStateView {
    initial = "facultySelector";

    faculty = state(0);
    group = state(0);

    setFaculty(faculty: number): void {
        this.faculty = faculty;
        this.changeState("groupSelector");
    }

    setGroup(group: number): void {
        this.group = group;
        this.close();
    }

    facultySelector(): OutMessageLike {
        return new ViewMessageBuilder()
            .addCode("Choose faculty")
            .addAction("Faculty 1", "setFaculty", 1)
            .addAction("Faculty 2", "setFaculty", 2)
            .addAction(1, "Faculty 3", "setFaculty", 3);
    }

    groupSelector(): OutMessageLike {
        return new ViewMessageBuilder()
            .addCode("Choose group")
            .addAction("Group 1", "setGroup", 1)
            .addAction(1, "Group 2", "setGroup", 2)
            .addAction(2, "Group 3", "setGroup", 3);
    }

    renderClosed(): OutMessageLike {
        return new ViewMessageBuilder()
            .addCodeLine("Спасибо, мы вам перезвоним")
            .addCodeLine(`Faculty: ${this.faculty}`)
            .addCodeLine(`Group: ${this.group}`);
    }
}
