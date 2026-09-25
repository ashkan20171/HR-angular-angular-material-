import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { AccountSecurityService } from '../../../core/auth/account-security.service';
import { SharedAuthApiService } from '../../../core/auth/shared-auth-api.service';
@Component({selector:'app-user-form',standalone:true,imports:[CommonModule,ReactiveFormsModule],templateUrl:'./user-form.html',styleUrl:'./user-form.css'})
export class UserForm{
 editing=false; error=''; showPassword=false; passwordErrors:string[]=[];
 form: FormGroup;
 constructor(private fb:FormBuilder,private userService:UserService,private route:ActivatedRoute,private router:Router,public language:LanguageService,private security:AccountSecurityService,private sharedApi:SharedAuthApiService){
  this.form=this.fb.group({id:[0],name:['',Validators.required],username:['',[Validators.required,Validators.minLength(3)]],email:['',[Validators.required,Validators.email]],role:['employee',Validators.required],password:[''],confirmPassword:[''],active:[true]});
  const id=this.route.snapshot.paramMap.get('id');if(id){this.editing=true;const u=this.userService.getById(+id);if(u)this.form.patchValue({...u,password:'',confirmPassword:''})}
 }
 get isFa(){return this.language.currentLanguage==='fa'} t(fa:string,en:string){return this.isFa?fa:en}
 get policy(){return this.security.policy()}
 passwordErrorText(code:string){const map:any={MIN_LENGTH:this.t(`حداقل ${this.policy.minLength} کاراکتر`,`At least ${this.policy.minLength} characters`),UPPER:this.t('حداقل یک حرف بزرگ انگلیسی (A-Z)','At least one uppercase letter (A-Z)'),LOWER:this.t('حداقل یک حرف کوچک انگلیسی (a-z)','At least one lowercase letter (a-z)'),NUMBER:this.t('حداقل یک عدد (0-9)','At least one number (0-9)'),SPECIAL:this.t('حداقل یک کاراکتر ویژه مثل !@#','At least one special character such as !@#')};return map[code]||code}
 checkPassword(){const value=this.form?.get('password')?.value||'';this.passwordErrors=value?this.security.validatePassword(value):[];}
 async save(){this.error='';this.checkPassword();if(this.form.invalid)return;const v=this.form.getRawValue();if(!this.editing&&!v.password){this.error=this.t('رمز عبور الزامی است.','Password is required.');return}if(v.password!==v.confirmPassword){this.error=this.t('رمز عبور و تکرار آن یکسان نیست.','Password and confirmation do not match.');return}if(v.password&&this.passwordErrors.length){this.error=this.t('لطفاً موارد مشخص‌شده در راهنمای رمز عبور را اصلاح کنید.','Please fix the password requirements shown below.');return}try{const {confirmPassword,...user}=v as any;user.username=(user.username||'').trim();user.password=String(user.password??'');if(this.editing){await this.sharedApi.update(user);this.userService.update(user)}else{const remote=await this.sharedApi.create(user);if(remote){this.userService.create({...user,id:remote.id})}else{this.userService.create(user)}}this.router.navigate(['/app/users'])}catch(e){this.error=this.t('این نام کاربری قبلاً ثبت شده است.','This username already exists.')}}
 cancel(){this.router.navigate(['/app/users'])}
}
