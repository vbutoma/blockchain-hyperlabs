import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {animalStatus, animalType, productionType, validUsers} from './enums';



@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.css']
})
export class AnimalsComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() farmerName: string;

  @Input() f1: string;
  @Input() f2: string;
  @Input() regulator: string;
  @Input() animalId: string;

  animals: {}[];
  fields: {}[];
  movements: {}[];

  ngOnInit() {
    this.farmerName = 'farmer1';
    this.animals = this.getAnimals();
    this.fields = this.getFields();
    this.movements = this.getMovements();
    this.getRequest(`http://localhost:8081/user?id=${this.farmerName}`)
      .then((data) => {
        // data[0] - animals
        // data[1] - fields
        // data[2] -- movements
        console.log(this.animals);
        data = JSON.parse(data);
        console.log('Init data', data)
        this.animals = [];
        this.fields = [];
        this.movements = [];
        data[0].forEach((x) => {
          this.animals.push(x.Record);
        });
        data[1].forEach((x) => {
          this.fields.push(x.Record);
        });
        data[2].forEach((x) => {
          const tmp = x.Record;
          tmp.mId = x.Key;
          console.log(tmp);
          this.movements.push(tmp);
        });

      })
      .catch((err) => {

      })
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      this.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }
  private log(msg: string) {
    console.log(msg);
  }

  getAnimals() {
    this.getRequest('')
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    const a = [
      {
        name: 'cubaki',
        status: 'IN_FIELD'
      }
    ];
    return a;
  }

  getFields() {
    return []
  }

  getMovements() {
    return []
  }

  getRequest(url: string): Promise<any> {
    return new Promise<any>(
      function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        request.onload = function () {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error(this.statusText));
          }
        };
        request.onerror = function () {
          reject(new Error('XMLHttpRequest Error: ' + this.statusText));
        };
        request.send();
      });
  }

  postRequest(url: string, body: {}): Promise<any> {
    return new Promise<any>(
      function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('POST', url);
        request.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = function () {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error(this.statusText));
          }
        };
        request.onerror = function () {
          reject(new Error('XMLHttpRequest Error: ' + this.statusText));
        };
        request.send(JSON.stringify(body));
      });
  }

  changeName(value) {
    console.log(value);
    if (!this.canSwitchUser(value)) return;
    this.farmerName = value;
    this.animals = this.getAnimals();
    this.fields = this.getFields();
    this.movements = this.getMovements();
    this.getRequest(`http://localhost:8081/user?id=${this.farmerName}`)
      .then((data) => {
        // data[0] - animals
        // data[1] - fields
        // data[2] -- movements
        console.log(this.animals);
        data = JSON.parse(data);
        this.animals = [];
        this.fields = [];
        this.movements = [];
        data[0].forEach((x) => {
          this.animals.push(x.Record);
        });
        data[1].forEach((x) => {
          this.fields.push(x.Record);
        });
        data[2].forEach((x) => {
          const tmp = x.Record;
          tmp.mId = x.Key;
          console.log(tmp);
          this.movements.push(tmp);
        });
      })
      .catch((err) => {

      })
  }

  createMovement(f1, f2, r, animalId) {
    const url = `http://localhost:8081/createMovement`;
    if (!(this.canSwitchUser(f1) && this.canSwitchUser(f2) && this.canSwitchUser(r))) return;
    animalId = +animalId;
    const body = {
      'firstFarmerId': f1,
      'secondFarmerId': f2,
      'regulatorId': r,
      'animalId': animalId,
      'status': 0
    };
    const animals = this.animals.filter(x => x.id === animalId);
    if (animals.length == 0) return;
    this.postRequest(url, body)
      .then((data) => {
        console.log('created');
        body['mId'] = data;
        this.movements.push(body);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  approveMovement(f1, mId) {
    const url = `http://localhost:8081/approve`;
    const curMovement = this.movements.filter(x => mId === x.mId);
    const body = JSON.parse(JSON.stringify(curMovement[0]))
    let bit = 0;
    if (body.firstFarmerId == f1) bit = 0;
    if (body.secondFarmerId == f1) bit = 1;
    if (body.regulatorId == f1) bit = 2;
    const mask = 1 << bit;
    body.status = +body.status;
    const prev = body.status;
    body.status += (body.status & mask) ? 0 : mask;
    if (body.status == prev) return;
    if (body.status === 7) {
      body.info = 'All Approved';
      this.updateAnimalField(body.animalId)
    }
    this.postRequest(url, body)
      .then(() => {
        console.log('Approved');
        // this.movements.push(body);
        const mid = this.movements.indexOf(curMovement[0]);
        if (mid != -1)
          this.movements.splice(mid, 1);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  updateAnimalField(animalId, fieldId, newFarmerID, force=false){
    const url = `http://localhost:8081/update_animal_field`;
    const curAnimal = this.animals.filter(x => animalId === x.id);
    const body = JSON.parse(JSON.stringify(curAnimal[0]));
    if (!force && !newFarmerID) {
      if (!this.fields.includes(fieldId)) return;
    }

    body.fieldId = fieldId;
    if (newFarmerID && newFarmerID !== this.farmerName)
      body.fieldId = newFarmerID;
    this.postRequest(url, body)
      .then(() => {
        // this.movements.push(body);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  animalInfo(x) {
    const statusId = 1;
    const prodId = 1;
    const tId = 1;
    let res = `AnimalStatus: ${Object.keys(animalStatus)[statusId]}; 
    ProductionType: ${Object.keys(productionType)[prodId]}; Type: ${Object.keys(animalType)[tId]}`;
    if (x.fieldId) res += ` Field: ${x.fieldId}`;
    return res;
  }

  moveInfo(x) {
    let approves = 0;
    if ([1, 2, 4].includes(x.status)) {
      approves = 1
    } else {
      if (x.status == 7) approves = 3;
      if ([3, 5].includes(x.status)) approves = 2;
    }
    let res = `NumberOfApproves: ${approves}; ${x.info || "Waiting"}`;
    return res;
  }

  canSwitchUser(name) {
    return validUsers.includes(name);
  }

}
