import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { EMPTY, from, Observable, of } from 'rxjs';
import { mergeMap, throwIfEmpty } from 'rxjs/operators';
import { SUBCATEGORY_MODEL } from 'src/database/database.constants';
import { Subcategory } from 'src/database/subcategory.model';
import { ChangeSubcategoryDto } from './change-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @Inject(SUBCATEGORY_MODEL) private subcategoryModel: Model<Subcategory>,
  ) {}

  findAll(): Observable<Subcategory[]> {
    return from(this.subcategoryModel.find().populate('news').exec());
  }

  findById(id: Partial<Subcategory> | string): Observable<Subcategory> {
    return from(
      this.subcategoryModel.findOne({ _id: id }).populate('news').exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`subcategory:$id was not found`),
      ),
    );
  }

  findByLink(url: string): Observable<Subcategory> {
    return from(
      this.subcategoryModel
        .findOne({ url: { $regex: url, $options: 'i' } })
        .exec(),
    ).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(
        () => new NotFoundException(`subcategory:$url was not found`),
      ),
    );
  }

  save(data: ChangeSubcategoryDto): Observable<Subcategory> {
    const createSubcateogry: Promise<Subcategory> = this.subcategoryModel.create(
      {
        ...data,
      },
    );
    return from(createSubcateogry);
  }

  update(id: string, data: ChangeSubcategoryDto): Observable<any> {
    return from(
      this.subcategoryModel
        .findOneAndUpdate({ _id: id }, { ...data } as any, { new: true })
        .exec(),
    ).pipe(
      throwIfEmpty(
        () => new NotFoundException(`subcategory:$id was not found`),
      ),
    );
  }

  deleteById(id: string): Observable<Subcategory> {
    return from(this.subcategoryModel.findByIdAndRemove(id).exec()).pipe(
      throwIfEmpty(
        () => new NotFoundException(`subcategory:$id was not found`),
      ),
    );
  }
}
