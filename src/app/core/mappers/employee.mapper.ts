import { DocumentData, StoredDocument } from '../data/data-store';
import { Employee, EmployeeDraft } from '../models/employee.model';
import { parseDayMonth } from '../utils/date.utils';
import { cleanString } from '../utils/text.utils';

export function toEmployee(document: StoredDocument): Employee {
  const data = document.data;
  return {
    id: document.id,
    registration: cleanString(data['registration']),
    name: cleanString(data['name']),
    birthday: parseDayMonth(data['birthday']),
  };
}

export function toEmployeeDocument(draft: EmployeeDraft): DocumentData {
  return {
    registration: cleanString(draft.registration),
    name: cleanString(draft.name),
    birthday: draft.birthday ?? '',
  };
}
