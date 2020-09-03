import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  currentMemberID: string;

  constructor(private fb: FormBuilder, private appService: AppService,
    private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const id =  this.route.snapshot.paramMap.get('id');
    this.memberForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      jobTitle: [''],
      team: [''],
      status: ['']
    });
    this.appService.getTeams().subscribe(team => {
      this.teams = team;
    });
    if (id) {
      this.currentMemberID = id ;
       this.appService.getMembers().subscribe(members => {
         if (members) {
            const currentmember = members.filter(x => x.id.toString() === id);
            this.memberForm.patchValue({
              firstName: currentmember[0].firstName,
              lastName: currentmember[0].lastName,
              jobTitle: currentmember[0].jobTitle,
              team: currentmember[0].team,
              status: currentmember[0].status
            });
         }
       });
    }
  }

  ngOnChanges() {

  }

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
    if (this.currentMemberID) {
      this.appService.editMembers(this.currentMemberID, this.memberModel).subscribe(data => {
        this.alertMessage = 'Member saved successfully';
        this.alertType = 'Success';
        this.router.navigate(['/members']);
      });
    } else {
    this.appService.addMember(this.memberModel).subscribe(data => {
      this.alertMessage = 'Member Added successfully';
      this.alertType = 'Success';
      this.router.navigate(['/members']);
    });
  }
  }
}
