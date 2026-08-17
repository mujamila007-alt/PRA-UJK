import { adminDb, FieldValue, requireParticipant, deleteAnswerDocs, json, errorResponse } from '../lib/firebaseAdmin.js';

export async function POST(request){
  try{
    const {decoded,profile}=await requireParticipant(request);const uid=decoded.uid;const settingSnap=await adminDb.doc('settings/exam').get();
    if(!settingSnap.exists)return json({error:'Pengaturan ujian belum dibuat.'},409);const s=settingSnap.data();if(s.status!=='aktif')return json({error:'Ujian belum dibuka oleh administrator.'},403);
    const questionSnap=await adminDb.collection('questions').orderBy('order').get();if(questionSnap.empty)return json({error:'Belum ada soal ujian.'},409);
    const now=Date.now(),ref=adminDb.doc(`attempts/${uid}`),old=await ref.get();
    if(old.exists){const a=old.data();if(a.status==='selesai')return json({completed:true});if(a.status==='berlangsung'&&Number(a.deadlineMs)>now)return json({completed:false,title:s.title||'Ujian',serverNow:now,deadlineMs:Number(a.deadlineMs),totalQuestions:a.totalQuestions||questionSnap.size});await deleteAnswerDocs(uid);}
    const duration=Math.max(1,Math.min(600,Number(s.durationMinutes)||60)),deadline=now+duration*60000;
    await ref.set({participantUid:uid,participantName:profile.name||'Peserta',status:'berlangsung',correctCount:0,wrongCount:0,totalQuestions:questionSnap.size,score:null,startedAt:FieldValue.serverTimestamp(),startedAtMs:now,deadlineMs:deadline,finishedAt:null,finishReason:null});
    return json({completed:false,title:s.title||'Ujian',serverNow:now,deadlineMs:deadline,totalQuestions:questionSnap.size});
  }catch(e){return errorResponse(e);}
}
